import { NextResponse } from 'next/server';
import { products } from '@/lib/products';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// Helper to log available models for debugging
async function logAvailableModels() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return;
    
    console.log("--- FETCHING AVAILABLE GEMINI MODELS ---");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      const availableModels = data.models
        .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
        .map((m: any) => m.name.replace('models/', ''));
      
      console.log("Supported Models for generateContent:", availableModels);
      return availableModels;
    }
  } catch (error) {
    console.error("Failed to fetch available models:", error);
  }
  return [];
}

const SYSTEM_INSTRUCTION = `
You are a helpful commerce assistant for "EcoShop", a store specializing in eco-friendly electronics.
Your goal is to help users find products, see details, compare items, and configure them for reservation.
Instead of a shopping cart, we have a product configurator and a reservation system.

AVAILABLE PRODUCTS:
${JSON.stringify(products, null, 2)}

RESPONSE GUIDELINES:
1. Always respond in JSON format.
2. The response must have two fields:
   - "content": A text message for the user.
   - "uiAction": An object representing a UI change, or null.

UI ACTION TYPES:
- { "type": "list", "products": [...] } : Show a list of products.
- { "type": "detail", "product": { ... } } : Show informative details for a specific product. User cannot configure here.
- { "type": "config", "product": { ... } } : Show the configurator for a specific product where the user can select options.
- { "type": "update_config", "config": { "OptionName": "Value", ... } } : Update selected options in the current configurator view without navigating away.
- { "type": "comparison", "products": [..., ...] } : Compare two or more products directly.
- { "type": "reservation", "reservation": { "product": { ... }, "config": { "OptionName": "SelectedValue", ... } } } : Show the reservation form for a specific product and configuration.
- { "type": "reserve", "product": { ... }, "config": { ... } } : Trigger a reservation for a product with a specific configuration.
 
If the user asks for products in general, use the "list" action.
If they ask about a specific product, start with "detail".
If they express interest in customizing or selecting options for a product, use "config".
If they are already in the configurator and want to change or select an option, use "update_config".
If they want to see the final comparison table, use "comparison".
If they are ready to reserve or "check out", use the "reserve" or "reservation" action.
If they just want to chat, set "uiAction" to null.
 
CURRENT CONFIGURATION (if in configurator):
{{CONFIG_STATE}}

CURRENT RESERVATION STATE:
{{RESERVATION_STATE}}
`;

export async function POST(req: Request) {
  try {
    const { messages, reservation, currentView } = await req.json();
    
    const configStateString = currentView?.activeConfig 
      ? JSON.stringify(currentView.activeConfig)
      : "No active configuration.";

    // Inject current reservation state into system instructions
    const reservationString = reservation 
      ? `Currently reserving: ${reservation.product.name} with config: ${JSON.stringify(reservation.config)}` 
      : "No active reservation.";
    
    const dynamicSystemInstruction = SYSTEM_INSTRUCTION
      .replace('{{CONFIG_STATE}}', configStateString)
      .replace('{{RESERVATION_STATE}}', reservationString);

    // Using gemini-3.1-flash-lite as requested.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: dynamicSystemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // Convert message history to Gemini format
    // Gemini requires history to start with a 'user' role message.
    // Our initial greeting is from 'ai' ('model'), so we filter it if it's the first message.
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (history.length > 0 && history[0].role === 'model') {
      history = history.slice(1);
    }
    
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();
    
    try {
      const parsedResponse = JSON.parse(responseText);
      return NextResponse.json(parsedResponse);
    } catch (e) {
      console.error("Failed to parse Gemini response:", responseText);
      return NextResponse.json({
        content: responseText,
        uiAction: null
      });
    }
  } catch (error: any) {
    console.error('Gemini Error:', error);
    // If it's a 404/Model not found error, provide a more helpful message
    const errorMessage = error?.message || 'Failed to process request';
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        const availableModels = await logAvailableModels();
        const modelList = availableModels?.length ? availableModels.join(", ") : "None found";
        
        return NextResponse.json({ 
            content: `I'm having trouble connecting to the Gemini model (gemini-3.1-flash-lite). Your API key currently has access to these models: ${modelList}. Please update the model in 'app/api/chat/route.ts' to one of these.`,
            uiAction: null,
            error: errorMessage
        }, { status: 500 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

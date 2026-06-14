# EcoShop AI - Prototype

A modern, AI-powered eco-commerce prototype built with Next.js, Gemini, and Tailwind CSS.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- A Google AI Studio API Key (Get one at [aistudio.google.com](https://aistudio.google.com/)).

### 2. Setup
```bash
# Install dependencies
npm install

# Create environment file
# Add your API key to .env.local
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local
echo "SITE_USERNAME=admin" >> .env.local
echo "SITE_PASSWORD=admin123" >> .env.local
```

### 3. Run the App
```bash
npm run dev
```
### 4. Password Protection
The site is protected by basic authentication. You can manage the credentials in `.env.local`. This protection is implemented using the `proxy.ts` convention.

## 🚀 Deployment

To share this prototype publicly, **Vercel** is the recommended platform.

### 1. Push to GitHub
Create a new repository on GitHub and push your code:
```bash
git remote add origin https://github.com/your-username/eco-shop-ai.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com/) and sign in.
2. Click **"New Project"** and import your repository.
3. In the **Environment Variables** section, add:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your API key from Google AI Studio.
   - `SITE_USERNAME`: Your chosen username.
   - `SITE_PASSWORD`: Your chosen password.
4. Click **Deploy**.

Once finished, Vercel will provide a public URL (e.g., `eco-shop-ai.vercel.app`) that you can share.

## ✨ Shareable Prototype Features

### 🤖 Intelligent AI Agent
- **Natural Language Shopping:** Ask things like "Show me sustainable phones" or "What's the best tablet for eco-conscious users?".
- **Cart Management:** The AI can directly add products to your cart. Try saying "Add the EcoPhone 15 to my cart."
- **Comparison Engine:** Ask "Compare the EcoPhone with the SolarTab" to see a side-by-side view.

### 🎨 Modern UI/UX
- **Smooth Animations:** Powered by `framer-motion` for a premium feel.
- **Dynamic Views:** The interface automatically switches between lists, details, comparisons, and the cart based on your conversation.
- **Real-time Feedback:** Toast notifications and loading states keep the experience responsive.

## 💡 Tips for Public Demonstrations

- **System Instruction Polish:** You can refine the "personality" of the assistant in `app/api/chat/route.ts` to match your specific brand voice.
- **Visuals:** Add high-quality product images to the `public` folder and update `lib/products.ts` with the correct paths for a more "finished" look.
- **Safety:** Ensure you never commit your `.env.local` file to GitHub. The provided `.gitignore` (standard for Next.js) should handle this, but always double-check.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **AI Model:** Google Gemini 3.5 Flash (via `@google/generative-ai`)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  imageUrl: string;
  options?: ProductOption[];
}

export interface Reservation {
  product: Product;
  config: Record<string, string>;
  date: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'EcoPhone 15',
    description: 'A sustainable smartphone with a focus on longevity and repairability.',
    price: 799,
    category: 'Phones',
    features: ['Recycled aluminum frame', 'User-replaceable battery', '100MP camera'],
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    options: [
      { name: 'Color', values: ['Forest Green', 'Ocean Blue', 'Earth Gray'] },
      { name: 'Storage', values: ['128GB', '256GB', '512GB'] }
    ]
  },
  {
    id: '2',
    name: 'SolarTab Pro',
    description: 'Powerful tablet with integrated solar panels for extended battery life.',
    price: 999,
    category: 'Tablets',
    features: ['12.9-inch OLED display', 'Solar charging', 'Stylus included'],
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    options: [
      { name: 'Panel Efficiency', values: ['Standard', 'High-Output (+ $100)'] },
      { name: 'Finish', values: ['Matte', 'Glossy'] }
    ]
  },
  {
    id: '3',
    name: 'BioLaptop Air',
    description: 'Lightweight laptop made from biodegradable materials and carbon-neutral manufacturing.',
    price: 1299,
    category: 'Computers',
    features: ['Biodegradable casing', '20-hour battery life', 'Passive cooling'],
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    options: [
      { name: 'Memory', values: ['16GB', '32GB', '64GB'] },
      { name: 'Keyboard', values: ['US English', 'UK English', 'German'] }
    ]
  },
  {
    id: '4',
    name: 'SmartWatch Green',
    description: 'Fitness tracker that plants trees based on your activity levels.',
    price: 199,
    category: 'Watches',
    features: ['Heart rate monitor', 'GPS', 'Tree-planting integration'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    options: [
      { name: 'Strap Material', values: ['Recycled Plastic', 'Organic Cotton', 'Vegan Leather'] },
      { name: 'Size', values: ['40mm', '44mm'] }
    ]
  },
  {
    id: '5',
    name: 'EcoPhone Mini',
    description: 'Compact eco-friendly smartphone that fits perfectly in your pocket.',
    price: 599,
    category: 'Phones',
    features: ['5.4-inch display', 'Energy-efficient processor', 'Modular parts'],
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
    options: [
      { name: 'Color', values: ['Coral Pink', 'Leaf Green', 'Stone Black'] },
      { name: 'Storage', values: ['64GB', '128GB', '256GB'] }
    ]
  },
  {
    id: '6',
    name: 'EcoPhone Ultra',
    description: 'The ultimate sustainable flagship with pro-grade features.',
    price: 1099,
    category: 'Phones',
    features: ['Titanium recycled frame', '6.8-inch LTPO display', 'Periscope zoom'],
    imageUrl: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400&h=400&fit=crop',
    options: [
      { name: 'Color', values: ['Shadow Black', 'Silver Frost', 'Gold Dust'] },
      { name: 'Storage', values: ['256GB', '512GB', '1TB'] }
    ]
  },
  {
    id: '7',
    name: 'SolarTab Mini',
    description: 'Portable solar tablet for creators on the move.',
    price: 499,
    category: 'Tablets',
    features: ['8.4-inch display', 'Featherlight design', 'Bamboo back cover'],
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
    options: [
      { name: 'Connectivity', values: ['Wi-Fi', 'Wi-Fi + 5G (+ $100)'] },
      { name: 'Cover', values: ['Hemp Sleeve', 'Cork Case'] }
    ]
  },
  {
    id: '8',
    name: 'SolarTab Air',
    description: 'Perfect balance of power and portability with ultra-efficient solar cells.',
    price: 749,
    category: 'Tablets',
    features: ['10.9-inch display', 'TrueTone technology', 'Recycled plastic chassis'],
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=400&fit=crop',
    options: [
      { name: 'Storage', values: ['64GB', '256GB'] },
      { name: 'Color', values: ['Sky Blue', 'Space Gray', 'Rose Gold'] }
    ]
  },
  {
    id: '9',
    name: 'BioLaptop Pro',
    description: 'Workstation-class performance in a fully recyclable body.',
    price: 1899,
    category: 'Computers',
    features: ['16-inch Liquid Retina display', '32GB RAM standard', 'Solar-boosted battery'],
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
    options: [
      { name: 'GPU', values: ['Integrated', 'Discrete Pro (+ $300)'] },
      { name: 'Storage', values: ['1TB', '2TB', '4TB'] }
    ]
  },
  {
    id: '10',
    name: 'BioLaptop Studio',
    description: 'Creative powerhouse with a flexible design and ethically sourced components.',
    price: 1599,
    category: 'Computers',
    features: ['Touchscreen', 'Detachable keyboard', 'Fair-trade minerals'],
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    options: [
      { name: 'Pen', values: ['Included', 'Pro Stylus (+ $50)'] },
      { name: 'RAM', values: ['16GB', '32GB'] }
    ]
  },
  {
    id: '11',
    name: 'SmartWatch Pro',
    description: 'Advanced health monitoring with a luxurious vegan leather strap.',
    price: 349,
    category: 'Watches',
    features: ['ECG & SpO2', 'Always-on display', 'Carbon-offset certificate'],
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aac296bd3b1?w=400&h=400&fit=crop',
    options: [
      { name: 'Case Material', values: ['Recycled Steel', 'Renewable Titanium'] },
      { name: 'Strap Color', values: ['Midnight', 'Saddle Brown', 'Desert Sand'] }
    ]
  },
  {
    id: '12',
    name: 'SmartWatch Active',
    description: 'Rugged fitness watch built for the toughest environments.',
    price: 249,
    category: 'Watches',
    features: ['5ATM Waterproof', 'Dual-band GPS', 'Impact-resistant glass'],
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
    options: [
      { name: 'Size', values: ['42mm', '46mm'] },
      { name: 'Band', values: ['Ocean Silicone', 'Reflective Nylon'] }
    ]
  }
];

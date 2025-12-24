
export interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerShare: number;
  totalShares: number;
  sharesSold: number;
  minInvestment: number;
  maxInvestment: number;
  propertyValue: number;
  projectedYield: number;
  images: string[];
  amenities: string[];
  documents: { name: string; verified: boolean }[];
}

export const PROPERTY_CONFIGS = {
  baliVilla: {
    configPDA: "BaLi1ViLLa...EXAMPLE_CONFIG_PDA",
    mintPDA: "BaLi1ViLLa...EXAMPLE_MINT_PDA",
    treasuryPDA: "BaLi1ViLLa...EXAMPLE_TREASURY_PDA",
  },
  miamiPenthouse: {
    configPDA: "MiAmI1PeNt...EXAMPLE_CONFIG_PDA",
    mintPDA: "MiAmI1PeNt...EXAMPLE_MINT_PDA",
    treasuryPDA: "MiAmI1PeNt...EXAMPLE_TREASURY_PDA",
  },
  dubaiApartment: {
    configPDA: "DuBaI1ApT...EXAMPLE_CONFIG_PDA",
    mintPDA: "DuBaI1ApT...EXAMPLE_MINT_PDA",
    treasuryPDA: "DuBaI1ApT...EXAMPLE_TREASURY_PDA",
  },
};

export const PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Bali Oceanfront Villa",
    location: "Uluwatu, Bali, Indonesia",
    description: "Luxurious 5-bedroom oceanfront villa with infinity pool, private beach access, and panoramic sunset views. Prime rental income potential in Bali's most sought-after location.",
    pricePerShare: 0.1,
    totalShares: 1000,
    sharesSold: 547,
    minInvestment: 1,
    maxInvestment: 100,
    propertyValue: 1200000,
    projectedYield: 8.5,
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
    ],
    amenities: ["Infinity Pool", "Private Beach", "5 Bedrooms", "Smart Home", "Ocean View", "Staff Quarters"],
    documents: [
      { name: "Property Deed", verified: true },
      { name: "Valuation Report", verified: true },
      { name: "Legal Opinion", verified: true },
    ],
  },
  {
    id: "2",
    name: "Miami Beach Penthouse",
    location: "South Beach, Miami, USA",
    description: "Stunning 4-bedroom penthouse with 360° ocean and city views. Located in the heart of South Beach with world-class amenities and direct beach access.",
    pricePerShare: 0.1,
    totalShares: 800,
    sharesSold: 312,
    minInvestment: 1,
    maxInvestment: 50,
    propertyValue: 2500000,
    projectedYield: 6.8,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    amenities: ["Rooftop Terrace", "Private Elevator", "4 Bedrooms", "Concierge", "Ocean View", "Gym"],
    documents: [
      { name: "Property Deed", verified: true },
      { name: "Valuation Report", verified: true },
      { name: "Legal Opinion", verified: true },
    ],
  },
  {
    id: "3",
    name: "Dubai Marina Luxury Apt",
    location: "Dubai Marina, UAE",
    description: "Premium 3-bedroom apartment in iconic Dubai Marina tower. Floor-to-ceiling windows with breathtaking marina views, high rental demand from executives.",
    pricePerShare: 0.1,
    totalShares: 600,
    sharesSold: 489,
    minInvestment: 1,
    maxInvestment: 75,
    propertyValue: 950000,
    projectedYield: 9.2,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    amenities: ["Marina View", "Pool", "3 Bedrooms", "Smart Home", "Gym", "Valet Parking"],
    documents: [
      { name: "Property Deed", verified: true },
      { name: "Valuation Report", verified: true },
      { name: "Legal Opinion", verified: true },
    ],
  },

  // {
  //   id: "4",
  //   name: "Modern Duplex",
  //   location: "Texas, US",
  //   description: "Premium 3-bedroom apartment in iconic Dubai Marina tower. Floor-to-ceiling windows with breathtaking marina views, high rental demand from executives.",
  //   pricePerShare: 0.13,
  //   totalShares: 700,
  //   sharesSold: 489,
  //   minInvestment: 1,
  //   maxInvestment: 75,
  //   propertyValue: 900000,
  //   projectedYield: 9.2,
  //   images: [
  //     "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=2167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   ],
  //   amenities: ["Backyard", "Pool", "3 Bedrooms", "Smart Home", "Gym", "Valet Parking"],
  //   documents: [
  //     { name: "Property Deed", verified: true },
  //     { name: "Valuation Report", verified: true },
  //     { name: "Legal Opinion", verified: true },
  //   ],
  // },
];

export const CRONOS_TESTNET_USDX = {
  address:"0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0",
  decimals: 6,
};

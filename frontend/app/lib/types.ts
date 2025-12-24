export type KYCStatus = "unverified" | "pending" | "verified" | "rejected";

export interface User {
  walletAddress: string;
  kycStatus: KYCStatus;
  sharesOwned: number;
  totalInvested: number;
}

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

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number | null;
  usdcBalance: number | null;
}

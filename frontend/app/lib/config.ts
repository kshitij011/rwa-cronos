// app/lib/config.ts

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { cronosTestnet } from 'viem/chains';

// ⚠️ IMPORTANT: Get your Project ID from WalletConnect Cloud!
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const config = getDefaultConfig({
  appName: 'X402 DApp',
  projectId: projectId,
  chains: [cronosTestnet],
  transports: {
    [cronosTestnet.id]: http(process.env.NEXT_PUBLIC_CRONOS_RPC),
  },
  ssr: true,
});
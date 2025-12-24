// @ts-nocheck
import { wrapFetchWithPayment } from "x402-fetch";
import { WalletClient } from "viem";

export function createX402Fetch(walletClient: WalletClient) {
  return wrapFetchWithPayment(fetch, walletClient as any);
}

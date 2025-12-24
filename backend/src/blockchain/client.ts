import "dotenv/config";
import { createWalletClient, createPublicClient, http } from "viem";
import { cronosTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const pk = process.env.DEPLOYER_PRIVATE_KEY;

if (!pk || !pk.startsWith("0x") || pk.length !== 66) {
  throw new Error("Invalid DEPLOYER_PRIVATE_KEY in .env");
}

const account = privateKeyToAccount(pk as `0x${string}`);
console.log("BACKEND SIGNER ADDRESS:", account);
console.log("BACKEND SIGNER ADDRESS 1:", account.address);

export const publicClient = createPublicClient({
  chain: cronosTestnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  account,
  chain: cronosTestnet,
  transport: http(),
});

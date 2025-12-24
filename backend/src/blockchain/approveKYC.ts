import { walletClient, publicClient } from "./client.ts";
import abi  from "../../abi/RealEstateTokenization.json" with {type: "json"};

const CONTRACT = "0xC573C58EfFCdE6f66034566Be7f00153082cE2DB";

export async function approveKycUser(user: `0x${string}`) {
  try {

    const owner = await publicClient.readContract({
  address: CONTRACT,
  abi: abi.abi,
  functionName: "owner",
});

console.log("User: ", user);
console.log("ON-CHAIN OWNER (BACKEND RPC):", owner);
console.log("BACKEND SIGNER:", walletClient.account.address);

    const hash = await walletClient.writeContract({
      address: CONTRACT,
      abi: abi.abi,
      functionName: "approveUser",
      args: [user],
      gas: 300_000n,
    });

    await publicClient.waitForTransactionReceipt({ hash });

    return { ok: true, hash };
  } catch (err: any) {
  console.error("KYC APPROVE ERROR:", err);

  return {
    ok: false,
    error: err.shortMessage,
    details: err,
  };
}

}

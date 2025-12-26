import { createWalletClient, createPublicClient, http } from "viem";
import { cronosTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import abi from "../../abi/RealEstateTokenization.json" with { type: "json" };

const account = privateKeyToAccount(process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`);

const publicClient = createPublicClient({
  chain: cronosTestnet,
  transport: http(process.env.RPC_URL),
});

const walletClient = createWalletClient({
  account,
  chain: cronosTestnet,
  transport: http(process.env.RPC_URL),
});

export async function mintShares({
  receiver,
  propertyId,
  amount,
  pricePaid,
}: {
  receiver: `0x${string}`;
  propertyId: bigint;
  amount: bigint;
  pricePaid: bigint;
}) {
  const hash = await walletClient.writeContract({
    address: process.env.ERC1155_ADDRESS as `0x${string}`,
    abi: abi.abi,
    functionName: "buyShares",
    args: [propertyId, receiver, amount, pricePaid],
    gas: 1_000_000n,
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}


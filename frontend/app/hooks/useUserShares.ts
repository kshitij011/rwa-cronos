import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { cronosTestnet } from "viem/chains";
import { Property } from "@/app/lib/constants";

const CONTRACT_ADDRESS = "0xC573C58EfFCdE6f66034566Be7f00153082cE2DB";

const ERC1155_ABI = [
  {
    name: "balanceOfBatch",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "accounts", type: "address[]" },
      { name: "ids", type: "uint256[]" },
    ],
    outputs: [{ type: "uint256[]" }],
  },
] as const;

const publicClient = createPublicClient({
  chain: cronosTestnet,
  transport: http(),
});

export function useUserShares(
    properties: Property[],
    isVerified: boolean,
    refreshKey: number
    ) {
    const { address, isConnected } = useAccount();
    const [shares, setShares] = useState<Record<number, bigint>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (!isConnected || !address || !isVerified || properties.length === 0) {
        setShares({});
        return;
    }

    async function fetchShares() {
        try {
        setLoading(true);

        const propertyIds = properties.map((p) => BigInt(p.id));
        const accounts = properties.map(() => address);

        const balances = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: ERC1155_ABI,
            functionName: "balanceOfBatch",
            args: [accounts as `0x${string}`[], propertyIds],
        });

        const mapped: Record<number, bigint> = {};
        properties.forEach((p, i) => {
            mapped[Number(p.id)] = balances[i];
        });

        setShares(mapped);
        } catch (err) {
        console.error("Failed to fetch user shares:", err);
        } finally {
        setLoading(false);
        }
    }

    fetchShares();
    }, [address, isConnected, isVerified, properties, refreshKey]);


  return { shares, loading };
}

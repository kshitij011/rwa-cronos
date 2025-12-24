import { useAccount, usePublicClient } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { useCallback, useEffect, useState } from "react";
import { CRONOS_TESTNET_USDX } from "@/app/lib/constants";

export function useUSDCBalance() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected || !publicClient) {
      setBalance("0");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const rawBalance = await publicClient.readContract({
        address: CRONOS_TESTNET_USDX.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });

      setBalance(formatUnits(rawBalance, CRONOS_TESTNET_USDX.decimals));
    } catch (err) {
      console.error("Failed to fetch USDC balance", err);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, publicClient]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    refresh: fetchBalance, // 👈 important
  };
}

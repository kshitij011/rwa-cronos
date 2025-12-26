import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { cronosTestnet } from "viem/chains";
import { KYCStatus } from "@/app/lib/types";

const KYC_CONTRACT = "0xC573C58EfFCdE6f66034566Be7f00153082cE2DB";

const KYC_ABI = [
  {
    name: "isKycVerified",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "bool" }],
  },
] as const;

export function useKyc() {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: cronosTestnet.id });

  const [kycStatus, setKycStatus] = useState<KYCStatus>("unverified");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !publicClient) {
      setKycStatus("unverified");
      setLoading(false);
      return;
    }

    const checkKyc = async () => {
      console.log("Checking KYC for address:", address);
      try {
        const isVerified = await publicClient.readContract({
          address: KYC_CONTRACT,
          abi: KYC_ABI,
          functionName: "isKycVerified",
          args: [address],
        });

        console.log("KYC status for", address, "is", isVerified);

        setKycStatus(isVerified ? "verified" : "unverified");

      } catch (err) {
        console.error("KYC check failed:", err);
        setKycStatus("unverified");
      } finally {
        setLoading(false);
      }
    };

    checkKyc();
  }, [address, publicClient]);

  const updateKycStatus = (newStatus: KYCStatus) => {
    setKycStatus(newStatus);
  };

  return {
    kycStatus,
    updateKycStatus,
    isVerified: kycStatus === "verified",
    loading,
  };
}
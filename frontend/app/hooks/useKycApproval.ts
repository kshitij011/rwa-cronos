export function useKycApproval() {
  const approve = async (address: string) => {
    const res = await fetch("https://rwa-cronos.onrender.com/kyc/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    if (!res.ok) throw new Error("KYC approval failed");

    return res.json();
  };

  return { approve };
}

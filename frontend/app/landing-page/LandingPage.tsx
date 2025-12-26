// app/landing-page/LandingPage.tsx
"use client"

import { useAccount } from "wagmi";
import { Footer } from "../components/Footer";
import { HowItWorks } from "../components/HowItWorks";
import { KYCFlow } from "../components/KYCFlow";
import { KYCSection } from "../components/KYCSection";
import Navbar from "../components/Navbar";
import { toast } from "../hooks/use-toast";
import { useState } from "react";
import { Property } from "../lib/types";
import { useKyc } from "../hooks/useKyc";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { PROPERTIES } from "../lib/constants";
import { PropertyListings } from "../components/PropertyListing";
import { BuySharesModal } from "../components/BuySharesModal";

export default function LandingPage() {
  const { kycStatus, updateKycStatus } = useKyc();
  console.log("Rendered LandingPage with KYC Status:", kycStatus);

  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();

  const [showKYC, setShowKYC] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [num, setNum] = useState(0);

  const handlePurchaseSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  // console.log("KYC Status:", kycStatus);

  const handleSelectProperty = (property: Property) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    if (kycStatus !== "verified") {
      setShowKYC(true);
      return;
    }

    setSelectedProperty(property);
    setShowBuyModal(true);
  };

  return (
    // 1. The main container now uses the custom CSS class
    <div className="min-h-screen relative overflow-hidden">

        {/* 2. The animated background layer (fixed position, covers everything) */}
        <div
            className="animated-gradient-bg fixed inset-0 z-0"
            aria-hidden="true"
        />

        {/* 3. Main content container (Sits above the background, max width) */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-8 p-4">
            <Navbar />

            {/* 4. Glass-themed content card */}

            <div className="
                p-10 rounded-3xl backdrop-blur-md bg-white/10 shadow-xl
                border border-white/20 text-white h-auto
            ">
              <div>
                <div className="flex justify-between items-center ">
                <h1 className="text-4xl font-bold mb-4 font-heading">Welcome to Estate Token</h1>
                <span className="text-md font-extrabold shadow text-shadow-lg shadow-white/70 p-1 rounded-2xl px-2">Powered by- X402 protocol</span>
                </div>
                <p className="text-lg font-body tracking-light font-mono">Check Wallet Connection: Connect your wallet & complete KYC to purchase property shares of your choice.</p>
              </div>
            </div>

            <div className="
                p-10 rounded-3xl backdrop-blur-md bg-white/10 shadow-xl
                border border-white/20 text-white min-h-[500px]
            ">
                <div className="mt-8">
                    <HowItWorks />
                </div>
            </div>

            <div className="mt-8">
                <KYCFlow
                open={showKYC}
                onOpenChange={setShowKYC}
                currentStatus={kycStatus}
                onSubmit={updateKycStatus}/>
            </div>

            <div className="
                p-10 rounded-3xl backdrop-blur-md bg-white/10 shadow-xl
                border border-white/20 text-white min-h-[500px]
            ">
                <div className="">
                    <KYCSection
                    isConnected={isConnected}
                    kycStatus={kycStatus}
                    onStartKYC={() => setShowKYC(true)}
                    onConnect={openConnectModal || (() => {})}/>
                </div>
            </div>

            <div className="
                p-10 rounded-3xl backdrop-blur-md bg-white/10 shadow-xl
                border border-white/20 text-white min-h-[500px]
            ">

                <div className="">
                    <PropertyListings
                      properties={PROPERTIES}
                      onSelectProperty={handleSelectProperty}
                      refreshKey={refreshKey}
                      kycStatus={kycStatus}
                      num={num}
                    />
                </div>
            </div>

            {selectedProperty && (
              <BuySharesModal
                open={showBuyModal}
                onOpenChange={setShowBuyModal}
                property={selectedProperty}
                onSharesMinted={() => setRefreshKey((k) => k + 1)}
                onSuccess={handlePurchaseSuccess}
                address={address!}
                setNum={setNum}
                num={num}
              />
            )}


            <div className="
                p-10 rounded-3xl backdrop-blur-md bg-white/10 shadow-xl
                border border-white/20 text-white min-h-[100px]
            ">
              <div className="mt-8">
                  <Footer />
              </div>
            </div>
        </div>
    </div>
  )
}
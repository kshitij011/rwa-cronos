import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Property, WalletState } from "@/app/lib/types";
import { Minus, Plus, Wallet, ArrowRight, CheckCircle2, Loader2, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/app/hooks/use-toast";
import { useUSDCBalance } from "@/app/hooks/useUSDCBalance";
import { useWalletClient } from "wagmi";
import { x402Fetch } from "@/app/components/utils/x402Cronos";

interface BuySharesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
  onSharesMinted: () => void;
  onSuccess: () => void;
  address: `0x${string}`;
  setNum: React.Dispatch<React.SetStateAction<number>>;
  num: number;
}

export function BuySharesModal({ open, onOpenChange, property, onSharesMinted, onSuccess, address, setNum, num }: BuySharesModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { balance, loading, refresh } = useUSDCBalance();
  const [mintTxHash, setMintTxHash] = useState("");
  const { data: walletClient } = useWalletClient();

  const totalCost = (quantity * property.pricePerShare);
  const canAfford = (Number(balance) || 0) >= totalCost;
  const remainingShares = property.totalShares - property.sharesSold;

  const mintExplorerUrl = mintTxHash
  ? `https://explorer.cronos.org/testnet/tx/${mintTxHash}`
  : '#';

  const slicedMintHash = mintTxHash
    ? `${mintTxHash.slice(0, 8)}...${mintTxHash.slice(-8)}`
    : 'N/A';

  const handleCopyMint = async () => {
        if (!mintTxHash) return;
        try {
        await navigator.clipboard.writeText(mintTxHash);
        toast({
            title: "Mint Transaction Copied",
            description: "The full transaction hash is now in your clipboard.",
        });
        } catch {
        toast({
            title: "Copy Failed",
            description: "Clipboard access blocked — please copy manually.",
            variant: "destructive",
        });
        }
    };

    const handleViewMintExplorer = () => {
        if (mintTxHash) window.open(mintExplorerUrl, "_blank");
    };

    const handleQuantityChange = (delta: number) => {
        const newQty = Math.max(1, Math.min(property.maxInvestment, quantity + delta, remainingShares));
        setQuantity(newQty);
    };

    const handlePurchase = async () => {
    if (!walletClient) {
        toast({
        title: "Wallet not ready",
        description: "Please connect your wallet",
        variant: "destructive",
        });
        return;
    }

    if (!canAfford) return;

    try {
        setIsPurchasing(true);

        const response = await x402Fetch( walletClient!,
          // "https://x402-rwa-evm.onrender.com/purchase",
        "https://rwa-cronos.onrender.com/api/purchase",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            propertyId: property.id,
            quantity,
            buyer: address,
            totalPrice: totalCost.toFixed(2),
            }),
        }
        );

        if (!response.ok) {
        throw new Error("Purchase failed");
        }

        const response2 = await x402Fetch( walletClient!,
          // "https://x402-rwa-evm.onrender.com/purchase",
        "https://rwa-cronos.onrender.com/mint",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            propertyId: property.id,
            quantity,
            buyer: address,
            totalPrice: totalCost.toFixed(2),
            }),
        }
        );

        const data = await response.json();
        console.log("Response:", data);

        setNum(num+quantity);
        let newValue = num + quantity;

        localStorage.setItem(`TxNounce_${property.id}`, newValue.toString());

        // setTxHash(data.paymentTxHash);
        setMintTxHash(data.mintTxHash);

        refresh();

        onSharesMinted();
        onSuccess();
        setIsSuccess(true);

    } catch (err: any) {
        console.error("Purchase failed:", err);
        toast({
        title: "Purchase Failed",
        description: err.message,
        variant: "destructive",
        });
    } finally {
        setIsPurchasing(false);
    }
    };

  const handleClose = () => {
    onOpenChange(false);
    setIsSuccess(false);
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border backdrop-blur-3xl bg-white/60 rounded-lg border border-white/60">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            {isSuccess ? "Purchase Complete" : "Buy Property Shares"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-2xl italic">
            {isSuccess ? "Your transaction was successful" : property.name}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-6 py-4">
            {/* Quantity Selector */}
            <div className="space-y-3">
              <Label className="text-foreground">Number of Shares</Label>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-12 w-12 rounded-xl"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(property.maxInvestment, parseInt(e.target.value) || 1, remainingShares)))}
                  className="w-24 h-14 text-center text-2xl font-bold bg-secondary border-border"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= property.maxInvestment || quantity >= remainingShares}
                  className="h-12 w-12 rounded-xl"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Max {Math.min(property.maxInvestment, remainingShares)} shares per user
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-secondary border border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per share</span>
                <span className="text-foreground">${property.pricePerShare} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="text-foreground">× {quantity}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-bold text-gold">${totalCost.toLocaleString()} USDC</span>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Your Balance</span>
              </div>
              <span className={`text-sm font-semibold ${canAfford ? "text-success" : "text-destructive"}`}>
                ${loading ? "…" : `${balance?.toLocaleString()} USDC`}
              </span>
            </div>

            {/* Purchase Button */}
            <Button
              variant="premium"
              size="lg"
              className="w-full"
              onClick={handlePurchase}
              disabled={!canAfford || isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing Transaction...
                </>
              ) : (
                <>
                  Confirm Purchase
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            {!canAfford && (
              <p className="text-xs text-center text-destructive">
                Insufficient USDC balance to complete this purchase
              </p>
            )}
          </div>
        ) : (
          <div className="py-8 text-center animate-scale-in">
            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Congratulations!
            </h3>
            <p className="text-muted-foreground mb-6">
              You now own <span className="text-gold font-semibold">{quantity} additional share(s)</span> of {property.name}
            </p>
            <div className="p-4 rounded-xl bg-secondary  mb-6">
                {/* MINTING BOX */}
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                    Transaction Hash
                    </p>

                    {/* Hash + Copy */}
                    <div className="flex items-center bg-secondary border border-border rounded-xl p-2 shadow-inner">
                    <Input
                        type="text"
                        value={slicedMintHash}
                        readOnly
                        className="flex grow font-mono text-xs md:text-sm bg-transparent border-none focus:ring-0 px-1"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyMint}
                        className="ml-2 w-8 h-8 flex shrink-0 hover:bg-muted/50"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    </div>

                    <Button
                variant="outline"
                className="w-full mt-3 text-xs md:text-sm text-foreground hover:bg-gold/10 border-gold/50 flex-nowrap truncate"
                onClick={handleViewMintExplorer}
                disabled={!mintTxHash}
                >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Cronos Explorer
                </Button>
            </div>
            <Button variant="gold" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

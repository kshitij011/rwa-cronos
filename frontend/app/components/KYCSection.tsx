import { Button } from "@/app/components/ui/button";
import { KYCStatus } from "@/app/lib/types";
import { Shield, CheckCircle2, Clock, XCircle, Upload, FileText, UserCheck, ArrowRight } from "lucide-react";


interface KYCSectionProps {
  isConnected: boolean;
  kycStatus: KYCStatus;
  onStartKYC: () => void;
  onConnect: () => void;
}

const statusConfig: Record<KYCStatus, { icon: typeof Shield; label: string; description: string; color: string; bgColor: string }> = {
  unverified: {
    icon: Shield,
    label: "Not Verified",
    description: "Complete identity verification to start investing",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  pending: {
    icon: Clock,
    label: "Verification Pending",
    description: "Your documents are being reviewed (1-2 business days)",
    color: "text-warning",
    bgColor: "bg-warning/20",
  },
  verified: {
    icon: CheckCircle2,
    label: "Verified Investor",
    description: "You're approved to invest in all listed properties",
    color: "text-success",
    bgColor: "bg-success/20",
  },
  rejected: {
    icon: XCircle,
    label: "Verification Failed",
    description: "Please resubmit with clearer documents",
    color: "text-destructive",
    bgColor: "bg-destructive/20",
  },
};

const steps = [
  {
    icon: Upload,
    title: "Upload Documents",
    description: "Passport, Driver's License, or National ID",
  },
  {
    icon: UserCheck,
    title: "Identity Check",
    description: "Automated verification with manual review",
  },
  {
    icon: CheckCircle2,
    title: "Get Approved",
    description: "Start investing once verified",
  },
];

export function KYCSection({ isConnected, kycStatus, onStartKYC, onConnect }: KYCSectionProps) {
  const status = statusConfig[kycStatus];
  const StatusIcon = status.icon;

    console.log("Connected: ", isConnected)

  return (
    <section id="kyc" className="py-10 px-6 bg-gradient-to-b from-background via-card/50 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium mb-4">
            <Shield className="h-3 w-3" />
            Regulatory Compliance
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Identity <span className="text-gradient-gold">Verification</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete KYC once to unlock investing across all properties. Your data is encrypted and secure.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* KYC Status Card */}
          <div className="p-8 rounded-3xl bg-gradient-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-16 w-16 rounded-2xl ${status.bgColor} flex items-center justify-center`}>
                <StatusIcon className={`h-8 w-8 ${status.color}`} />
              </div>
              <div>
                <h3 className={`font-display text-xl font-semibold ${status.color}`}>
                  {status.label}
                </h3>
                <p className="text-sm text-muted-foreground">{status.description}</p>
              </div>
            </div>

            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet first to begin the verification process.
                </p>
                <Button variant="gold" size="lg" onClick={onConnect} className="w-full backdrop-blur-3xl">
                  Connect Wallet to Start
                </Button>
              </div>
            ) : kycStatus === "unverified" ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary border border-border">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Required Documents</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Government-issued ID (Passport, Driver's License, or National ID)
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="gold" size="lg" onClick={onStartKYC} className="w-full group">
                  Start Verification
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            ) : kycStatus === "pending" ? (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
                <p className="text-sm text-warning">
                  Our compliance team is reviewing your submission. You'll receive an email notification once complete.
                </p>
              </div>
            ) : kycStatus === "verified" ? (
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <p className="text-sm text-success">
                  You're all set! Browse the properties below and start building your portfolio.
                </p>
              </div>
            ) : (
              <Button variant="goldOutline" size="lg" onClick={onStartKYC} className="w-full">
                Resubmit Documents
              </Button>
            )}
          </div>

          {/* KYC Steps */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-8">
              Simple 3-Step Process
            </h3>
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center relative">
                    <step.icon className="h-6 w-6 text-gold" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <div className="pt-1">
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}

            <div className="mt-8 p-4 rounded-xl bg-secondary border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="text-gold font-medium">🔒 Security:</span> Your documents are encrypted end-to-end and stored securely. We comply with GDPR and international privacy standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

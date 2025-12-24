import { Wallet, Shield, Coins, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your EVM wallet (Metamask) to access the platform securely.",
  },
  {
    icon: Shield,
    title: "Complete KYC",
    description: "Verify your identity to comply with regulatory requirements. Takes just minutes.",
  },
  {
    icon: Coins,
    title: "Buy Shares",
    description: "Choose your investment amount and purchase property tokens with USDC.",
  },
  {
    icon: TrendingUp,
    title: "Earn Returns",
    description: "Receive rental income proportional to your ownership. Trade anytime.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="font-poppins ">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Invest in premium real estate in four simple steps. No middlemen, no paperwork, instant settlement.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full bg-gradient-to-r from-border via-gold/30 to-border z-0"/>
              )}

              <div className="relative z-10 p-6 rounded-2xl bg-gradient-card border border-border transition-all duration-300 hover:border-gold/30 hover:shadow-gold-glow/5 h-full shadow-black shadow-2xl">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gold flex items-center justify-center font-bold text-primary-foreground pr-8 pt-8 text-2xl">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="h-14 w-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <step.icon className="h-7 w-7 text-gold" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

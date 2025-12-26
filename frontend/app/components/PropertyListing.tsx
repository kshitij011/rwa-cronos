
import { MapPin, TrendingUp, Lock, ArrowRight } from "lucide-react";
import { Property } from "../lib/constants";
import { useUserShares } from "@/app/hooks/useUserShares";

interface PropertyListingsProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  refreshKey: number;
  kycStatus: string;
  num: number;
}

export function PropertyListings({ properties, kycStatus, onSelectProperty, refreshKey, num }: PropertyListingsProps) {

  let isVerified;
  if(kycStatus === "verified") {
    isVerified = true;
  } else {
    isVerified = false;
  }

  const { shares, loading } = useUserShares(properties, isVerified, refreshKey);

  return (
    <section id="properties" className="py-10 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success text-xs font-medium mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse bg-green-500" />
            Live Offerings
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Property <span className="text-gradient-gold">Listings</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium real estate opportunities tokenized on Cronos. Each property is legally verified and professionally managed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const fundingPercentage = (property.sharesSold / property.totalShares) * 100;
            const remainingShares = property.totalShares - property.sharesSold;

            return (
              <div
                key={property.id}
                className="group rounded-3xl bg-gradient-card border border-border overflow-hidden transition-all duration-300 hover:border-gold/30 shadow-gray-500 shadow-2xs hover:shadow-[0_0_20px_hsl(42_100%_50%/0.1)]"
              >
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                  {/* Yield Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gold/90 text-primary-foreground text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {property.projectedYield}% APY
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-foreground">
                    <MapPin className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium">{property.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {property.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-secondary">
                      <p className="text-xs text-muted-foreground">Property Value</p>
                      <p className="text-lg font-bold text-foreground">
                        ${(property.propertyValue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary">
                      <p className="text-xs text-muted-foreground">Share Price</p>
                      <p className="text-lg font-bold text-gold">
                        ${property.pricePerShare}
                      </p>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="text-gold font-medium">{fundingPercentage.toFixed(0)}%</span>
                    </div>
                    {/* <Progress value={fundingPercentage} className="h-2" /> */}
                    <p className="text-xs text-muted-foreground">
                      {remainingShares.toLocaleString()} shares remaining
                    </p>
                  </div>

                  {/* My Shares */}
                  {isVerified && (
                    <div className="p-3 rounded-xl bg-secondary border border-border">
                      <p className="text-xs text-muted-foreground">Shares owned</p>
                      <p className="text-lg font-semibold text-gold">
                        {/* {ownedShares[property.id] ?? 0} */}
                        {/* {loading ? "…" : (shares[Number(property.id)]?.toString() ?? "0")} */}
                        {localStorage.getItem(`TxNounce_${property.id}`)??0}
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div
                    className="w-full group/btn bg-white/20 backdrop-blur-3xl border border-white/40 hover:bg-white/50 text-white font-semibold py-3 px-5 rounded-xl text-center cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-lg"
                    onClick={() => onSelectProperty(property)}
                  >
                    {isVerified ? (
                      <>
                        Invest Now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-1" />
                        KYC Required
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

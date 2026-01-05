"use client";

import { Users } from "lucide-react";

type PriceTier = {
  id: string;
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  description?: string | null;
};

type Props = {
  priceTiers: PriceTier[];
  currency?: string;
};

export default function PricingTable({ priceTiers, currency = "USD" }: Props) {
  if (!priceTiers || priceTiers.length === 0) {
    return null;
  }

  const sortedTiers = [...priceTiers].sort((a, b) => a.minPax - b.minPax);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPaxRange = (min: number, max: number) => {
    if (min === max) {
      return `${min} pax`;
    }
    return `${min}-${max} pax`;
  };

  return (
    <div className="bg-white rounded-lg border border-sand overflow-hidden">
      <div className="bg-forest-900 text-ivory px-4 py-3 flex items-center gap-2">
        <Users className="w-5 h-5" />
        <h3 className="font-semibold">Tour Pricing</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-sand border-b border-sand">
              <th className="px-4 py-3 text-left text-sm font-semibold text-forest-700">
                Group Size
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-forest-700">
                Price per Person
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTiers.map((tier, index) => (
              <tr
                key={tier.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-sand/50"
                } hover:bg-gold-500/10 transition-colors`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-forest-900">
                      {formatPaxRange(tier.minPax, tier.maxPax)}
                    </span>
                    {tier.description && (
                      <span className="text-xs text-stone">
                        ({tier.description})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-gold-700 text-lg">
                    {formatPrice(tier.pricePerPerson)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-sand border-t border-sand">
        <p className="text-xs text-stone">
          * Prices are per person and subject to availability
        </p>
      </div>
    </div>
  );
}

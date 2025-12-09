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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2">
        <Users className="w-5 h-5" />
        <h3 className="font-semibold">Tour Pricing</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Group Size
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Price per Person
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTiers.map((tier, index) => (
              <tr
                key={tier.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {formatPaxRange(tier.minPax, tier.maxPax)}
                    </span>
                    {tier.description && (
                      <span className="text-xs text-gray-500">
                        ({tier.description})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-blue-600 text-lg">
                    {formatPrice(tier.pricePerPerson)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          * Prices are per person and subject to availability
        </p>
      </div>
    </div>
  );
}

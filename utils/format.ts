export function currency(amount: number, currencySymbol = "$") {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

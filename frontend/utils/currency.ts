export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPricePerQuintal(amount: number): string {
  return `${formatINR(amount)} / Qtl`;
}
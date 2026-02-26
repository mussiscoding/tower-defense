export const formatNumber = (num: number): string => {
  const n = Math.floor(num);
  if (n >= 100_000_000_000) return `${Math.floor(n / 1_000_000_000)}B`;
  if (n >= 100_000_000) return `${Math.floor(n / 1_000_000)}M`;
  if (n >= 100_000) return `${Math.floor(n / 1_000)}K`;
  return n.toLocaleString();
};

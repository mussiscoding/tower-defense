export const formatNumber = (num: number): string => {
  const n = Math.floor(num);
  if (n >= 100_000_000_000) return `${Math.floor(n / 1_000_000_000).toLocaleString()}B`;
  if (n >= 100_000_000) return `${Math.floor(n / 1_000_000).toLocaleString()}M`;
  if (n >= 100_000) return `${Math.floor(n / 1_000).toLocaleString()}K`;
  return n.toLocaleString();
};

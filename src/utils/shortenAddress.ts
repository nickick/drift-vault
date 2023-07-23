export const shortenAddress = (address?: string, length?: number) => {
  if (!address) return "";
  const pre = length ? Math.round(length / 2) : 5;
  const post = length ? Math.round(length / 2) : 4;
  return `${address.slice(0, pre)}...${address.slice(address.length - post)}`;
};

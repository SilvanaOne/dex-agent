export function shortenString(
  str: string | undefined,
  maxLength: number = 10
): string {
  if (!str) return "";
  if (str.length <= maxLength) {
    return str;
  }
  const halfLength = Math.floor((maxLength - 5) / 2);
  return `${str.slice(0, halfLength + 3)}...${str.slice(-halfLength)}`;
}

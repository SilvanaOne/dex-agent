export function formatBalance(
  num: number | bigint | undefined,
  digits: number = 4
): string {
  if (num === undefined) return "-";
  const fixed = (Number(BigInt(num) / 1_000n) / 1_000_000).toLocaleString(
    undefined,
    {
      maximumSignificantDigits: digits,
    }
  );
  return fixed;
}

export function formatPrice(
  num: number | bigint | string | undefined,
  digits: number = 4
): string {
  if (num === undefined) return "-";
  const fixed = Number(num).toLocaleString(undefined, {
    maximumSignificantDigits: digits,
  });
  return fixed;
}

export function formatTime(timestamp: number, currentTime: number) {
  const diff = currentTime - timestamp;
  if (diff < 1000) {
    return "now";
  }
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return `${seconds}s ago`;
  }
}

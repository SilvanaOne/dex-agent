export function debug(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG === "true";
}

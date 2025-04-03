export async function start(key: string) {
  const response = await fetch("/api/v1/background", {
    method: "POST",
    body: JSON.stringify({ key }),
  });
  return response.json();
}

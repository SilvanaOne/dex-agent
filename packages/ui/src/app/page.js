import DEX from "@/components/dex/dex";
import { getSiteName } from "@/lib/chain";

export const metadata = {
  title: `${getSiteName()}`,
};

export default function Home() {
  return <DEX />;
}

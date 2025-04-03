import TokenFooter from "@/components/footer/TokenFooter";
//import TokenHeader from "@/components/headers/TokenHeader";
import NotFound from "@/components/pages/404";
import { getSiteName } from "@/lib/chain";

export const metadata = {
  title: `${getSiteName()} | Not Found`,
};

export default function NotFoundPage() {
  return (
    <>
      {/* <TokenHeader showSearch={false} /> */}
      <main className="pt-[5.5rem] lg:pt-24">
        <NotFound />
      </main>
      <TokenFooter />
    </>
  );
}

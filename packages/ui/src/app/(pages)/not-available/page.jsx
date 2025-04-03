"use client";

import TokenFooter from "@/components/footer/TokenFooter";
//import TokenHeader from "@/components/headers/TokenHeader";
import NotAvailable from "@/components/pages/NotAvailable";
import { getSiteName } from "@/lib/chain";

// export const metadata = {
//   title: `${getSiteName()} | Not Available`,
// };

export default function NotAvailablePage() {
  return (
    <>
      {/* <TokenHeader showSearch={false} /> */}
      <main className="pt-[5.5rem] lg:pt-24">
        <NotAvailable />
      </main>
      <TokenFooter />
    </>
  );
}

"use client";

import TokenFooter from "@/components/footer/TokenFooter";
//import TokenHeader from "@/components/headers/TokenHeader";
import Terms from "@/components/pages/terms/Terms";

// export const metadata = {
//   title: "Terms of Service || MinaTokens.com",
// };

export default function TermsPage() {
  return (
    <>
      {/* <TokenHeader showSearch={false} /> */}
      <main className="pt-[5.5rem] lg:pt-24">
        <Terms />
      </main>
      <TokenFooter />
    </>
  );
}

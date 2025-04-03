"use client";

import TokenFooter from "@/components/footer/TokenFooter";
//import TokenHeader from "@/components/headers/TokenHeader";
import Privacy from "@/components/pages/privacy/Privacy";

// export const metadata = {
//   title: "Privacy Policy || MinaTokens.com",
// };

export default function PrivacyPage() {
  return (
    <>
      {/* <TokenHeader showSearch={false} /> */}
      <main className="pt-[5.5rem] lg:pt-24">
        <Privacy />
      </main>
      <TokenFooter />
    </>
  );
}

"use client";

import "@/public/styles/style.css";
import "swiper/css";
import ModeChanger from "@/components/common/ModeChanger";
import { AddressProvider } from "@/context/address";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Script from "next/script";

if (typeof window !== "undefined") {
  // Import the script only on the client side
  import("bootstrap/dist/js/bootstrap.esm" as any).then((module) => {
    // Module is imported, you can access any exported functionality
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" className="dark" suppressHydrationWarning={true}>
        <head>
          <GoogleAnalytics
            GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
          />
        </head>
        <body
          itemScope
          itemType="http://schema.org/WebPage"
          className="overflow-x-hidden font-body text-jacarta-500 dark:bg-jacarta-900"
          suppressHydrationWarning={true}
        >
          <AddressProvider>
            <ModeChanger />
            {children}
          </AddressProvider>
          <Analytics />
          <SpeedInsights />
          <Script
            id="ze-snippet"
            src="https://static.zdassets.com/ekr/snippet.js?key=4ea5acb7-4afc-49af-9820-e1576d7580ee"
            crossOrigin="anonymous"
            strategy="afterInteractive"
            async
            defer
            data-cfasync="false"
            referrerPolicy="origin"
          />
        </body>
      </html>
    </>
  );
}

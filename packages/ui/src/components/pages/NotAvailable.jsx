"use client";
import Image from "next/image";
import Link from "next/link";
import { unavailableCountry } from "@/lib/availability";

export default function NotAvailable() {
  const country = unavailableCountry?.name ?? "your country";
  return (
    <section className="relative py-16 dark:bg-jacarta-800 md:py-24">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={789}
          src="/img/gradient_light.jpg"
          priority
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <Image
            width={192}
            height={108}
            src="/img/maintenance.jpg"
            alt="image"
            className="mb-8 inline-block"
          />
          <h2 className="mb-6 font-display text-4xl text-jacarta-700 dark:text-white md:text-4xl">
            Not Available in {country}
          </h2>
          <p className="mb-12  leading-normal dark:text-jacarta-300">
            MinaTokens.com services are currently not available in {country} due
            to regulatory requirements. We are working diligently to expand our
            coverage and will announce when our services become available in
            your country. Please check back later or follow our social media
            channels for updates on service availability in your area.
          </p>
          <Link
            href="https://minascan.io/directory"
            className="inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
          >
            Explore Other Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

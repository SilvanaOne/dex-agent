import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { unavailableCountry, checkAvailability } from "@/lib/availability";
import NotAvailable from "@/components/pages/NotAvailable";

export default function Hero() {
  const [isAvailable, setIsAvailable] =
    useState < boolean > !unavailableCountry;
  useEffect(() => {
    checkAvailability().then((result) => {
      setIsAvailable(!result);
      if (result) window.location.href = "/not-available";
    });
  }, []);
  return (
    <>
      {isAvailable && (
        <section className="relative h-screen after:absolute after:inset-0 after:bg-jacarta-900/50">
          <Image
            width={1920}
            height={1080}
            src="/img/maintenance.jpg"
            alt="image"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />

          <div className="container relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-lg text-center">
              <p className="mb-8 text-lg leading-normal text-white">
                We will be back soon...
              </p>
              <h1 className="mb-6 font-display text-4xl text-white md:text-6xl">
                Website Is Under Maintanance
              </h1>
              <Link
                href="/"
                className="inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )}
      {!isAvailable && <NotAvailable />}
    </>
  );
}

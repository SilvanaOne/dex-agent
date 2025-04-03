import Image from "next/image";

export default function PageTitle() {
  return (
    <section className="relative pt-24 lg:pb-96">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={789}
          src="/img/gradient_light.jpg"
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <div className="container">
        <div className="mx-auto max-w-2xl py-16 text-center">
          <h1 className="mb-8 font-display text-4xl font-medium text-jacarta-700 dark:text-white">
            About MinaTokens.com
          </h1>
          <p className="text-lg leading-normal dark:text-jacarta-300">
            MinaTokens.com is a platform for creating, buying, and selling MINA
            custom tokens.
          </p>
        </div>
      </div>
    </section>
  );
}

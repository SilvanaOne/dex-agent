import { blogs2 } from "@/data/blogs";
import Image from "next/image";
import Link from "next/link";

export default function Blogs() {
  return (
    <section className="relative py-24">
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
        <h2 className="mb-12 text-center font-display text-3xl text-jacarta-700 dark:text-white">
          You Might Have Read About Us In The News
        </h2>
        <div className="grid grid-cols-1 gap-[1.875rem] sm:grid-cols-2 md:grid-cols-3">
          {blogs2.slice(0, 3).map((elm, i) => (
            <article key={i}>
              <div className="overflow-hidden rounded-2.5xl transition-shadow hover:shadow-lg">
                <figure className="group overflow-hidden">
                  <Link href={`/single-post/${elm.id}`}>
                    <Image
                      width={370}
                      height={250}
                      src={elm.imgSrc}
                      alt="post 2"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] will-change-transform group-hover:scale-105"
                    />
                  </Link>
                </figure>

                {/* Body */}
                <div className="rounded-b-[1.25rem] border border-t-0 border-jacarta-100 bg-white p-[10%] dark:border-jacarta-600 dark:bg-jacarta-700">
                  {/* Meta */}
                  <div className="mb-3 flex flex-wrap items-center space-x-1 text-xs">
                    <a
                      href="#"
                      className="font-display text-jacarta-700 hover:text-accent dark:text-jacarta-200"
                    >
                      {elm.writer}
                    </a>
                    <span className="dark:text-jacarta-400">in</span>
                    <span className="inline-flex flex-wrap items-center space-x-1 text-accent">
                      {elm.category}
                    </span>
                  </div>

                  <h2 className="mb-4 font-display text-xl text-jacarta-700 hover:text-accent dark:text-white dark:hover:text-accent">
                    <Link href={`/single-post/${elm.id}`}> {elm.title}</Link>
                  </h2>
                  <p className="mb-8 dark:text-jacarta-200">{elm.desc}</p>

                  {/* Date / Time */}
                  <div className="flex flex-wrap items-center space-x-2 text-sm text-jacarta-400">
                    <span>
                      <time>{elm.date}</time>
                    </span>
                    <span>•</span>
                    <span>3 min read</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

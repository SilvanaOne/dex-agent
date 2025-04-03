/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";

export default function Story() {
  return (
    <section className="relative py-24 dark:bg-jacarta-800">
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
        <div className="lg:flex lg:justify-between">
          <div className="lg:w-[55%]">
            <div className="relative">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mt-8 w-[80%] rotate-[8deg]"
              >
                <defs>
                  <clipPath id="clipping" clipPathUnits="userSpaceOnUse">
                    <path
                      d="
                    M 0, 100
                    C 0, 17.000000000000004 17.000000000000004, 0 100, 0
                    S 200, 17.000000000000004 200, 100
                        183, 200 100, 200
                        0, 183 0, 100
                "
                      fill="#9446ED"
                    ></path>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipping)">
                  <image
                    href="/img/about/story.jpg"
                    width="200"
                    height="200"
                    clipPath="url(#clipping)"
                  />
                </g>
              </svg>
              <Image
                width={740}
                height={602}
                src="/img/hero/3D_elements.png"
                alt="image"
                className="absolute top-0 animate-fly"
              />
            </div>
          </div>

          <div className="py-20 lg:w-[45%] lg:pl-16">
            <h2 className="mb-6 font-display text-2xl text-jacarta-700 dark:text-white">
              Get Experience. We're A Results Driven Team.
            </h2>
            <p className="mb-8 text-lg leading-normal dark:text-jacarta-300">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam
            </p>
            <p className="mb-10 dark:text-jacarta-300">
              Every digital creation available through MakersPlace is an
              authentic and truly unique digital creation, signed and issued by
              the creator — made possible by blockchain technology. Even if the
              digital creation is copied, it won't be the authentic and
              originally signed version.
            </p>
            <div className="flex space-x-4 sm:space-x-10">
              <div className="flex space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-8 w-8 shrink-0 fill-accent"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
                </svg>
                <div>
                  <span className="block font-display text-xl text-jacarta-700 dark:text-white">
                    11,2k+
                  </span>
                  <span className="text-jacarta-700 dark:text-jacarta-300">
                    Products launched
                  </span>
                </div>
              </div>
              <div className="flex space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-8 w-8 shrink-0 fill-accent"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
                </svg>
                <div>
                  <span className="block font-display text-xl text-jacarta-700 dark:text-white">
                    99,7%
                  </span>
                  <span className="text-jacarta-700 dark:text-jacarta-300">
                    Satisfaction Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { teamMembers } from "@/data/team";
import Image from "next/image";
import Link from "next/link";

export default function Team() {
  return (
    <section className="py-24">
      <div className="container">
        <h2 className="mb-12 text-center font-display text-3xl text-jacarta-700 dark:text-white">
          Meet Our Amazing Team
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-[1.875rem] lg:grid-cols-5">
          {teamMembers.map((elm, i) => (
            <div
              key={i}
              className="rounded-2lg border border-jacarta-100 bg-white p-8 text-center transition-shadow hover:shadow-lg dark:border-jacarta-600 dark:bg-jacarta-700"
            >
              <Image
                width={130}
                height={130}
                src={elm.imageSrc}
                className="mx-auto mb-6 h-[8.125rem] w-[8.125rem] rounded-2.5xl"
                alt="team"
              />
              <h3 className="font-display text-md text-jacarta-700 dark:text-white">
                {elm.name}
              </h3>
              <span className="text-2xs font-medium tracking-tight text-jacarta-400">
                {elm.position}
              </span>

              <div className="mt-3 flex justify-center space-x-5">
                {elm.socials.map((elm2, i2) => (
                  <a key={i2} href="#" className="group">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="linkedin"
                      className="h-4 w-4 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d={elm2.svgPath}></path>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <Link
            href="/careers"
            className="flex items-center justify-center rounded-2lg border border-jacarta-100 bg-white p-8 text-center transition-shadow hover:shadow-lg dark:border-jacarta-600 dark:bg-jacarta-700"
          >
            <span className="font-display text-md text-jacarta-700 dark:text-white">
              Join us!
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { socials } from "./socials-data";

export default function Socials() {
  return (
    <>
      {socials.map((elm, i) => (
        <a
          key={i}
          href={elm.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group rtl:ml-4 rtl:mr-0"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon={elm.icon}
            className="h-5 w-5 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={elm.icon == "discord" ? "0 0 640 512" : "0 0 512 512"}
          >
            <path d={elm.svgPath}></path>
          </svg>
        </a>
      ))}
    </>
  );
}

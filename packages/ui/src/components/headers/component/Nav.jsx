"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isActiveParentMenu = (menus) => {
    return menus.some(
      (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
    );
  };

  return (
    <>
      <li className="group">
        <Link
          href={"/"}
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          {"Trade"}
        </Link>
      </li>

      <li className="group">
        <Link
          href="/users"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/users".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Users
        </Link>
      </li>

      <li className="group">
        <Link
          href={"https://silvascan.io/testnet/rollup-txs"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between py-3.5 font-display text-base text-jacarta-700 dark:text-white
          hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Explorer
        </Link>
      </li>

      <li className="group">
        <Link
          href={"https://minascan.io/devnet/account/B62qoDLPX1e8ZWeeCpTQnjWYRumJ9mcmzRcuf7FkU4PL3Jai56tSEto/zk-txs"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between py-3.5 font-display text-base text-jacarta-700 dark:text-white
          hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Settlement contract
        </Link>
      </li>

      <li className="group">
        <Link
          href={"https://suiscan.xyz/devnet/object/0x888f1991967e8f4a6bb0fbbfaf547ae0154ce2e187ec96e248f87f4b57393a93/tx-blocks"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between py-3.5 font-display text-base text-jacarta-700 dark:text-white
          hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Sui ZK layer
        </Link>
      </li>

      {/* <li className="js-nav-dropdown group relative">
        <Link
          href="#"
          className={`dropdown-toggle flex items-center justify-between py-3.5 font-display text-base text-black ${
            isActiveParentMenu(resources)
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent lg:px-5 `}
          id="navDropdown-4"
          aria-expanded="false"
          role="button"
          data-bs-toggle="dropdown"
        >
          Resources
          <i className="lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-4 w-4 dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
            </svg>
          </i>
        </Link>
        <ul
          className="dropdown-menu group-hover:visible lg:invisible left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:opacity-100 dark:bg-jacarta-800 lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2"
          aria-labelledby="navDropdown-4"
        >
          {resources.map((elm, i) => (
            <li key={i}>
              <Link
                href={elm.href}
                className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
              >
                <span
                  className={`font-display text-sm  ${
                    elm.href.split("/")[1] == pathname.split("/")[1]
                      ? "text-accent dark:text-accent"
                      : "text-jacarta-700 dark:text-white"
                  } `}
                >
                  {elm.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </li> */}
    </>
  );
}

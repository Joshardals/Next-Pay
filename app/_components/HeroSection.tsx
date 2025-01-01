import { FEATURES } from "@/lib/data";
import Link from "next/link";
import { Chart } from "./Chart";

export function HeroSection() {
  return (
    <section className="flex max-md:flex-col space-x-5 justify-between items-center">
      <div className="flex-1">
        <h1 className=" max-md:text-center text-[3rem] sm:text-5xl md:text-[75px] leading-[1.2] font-bold text-snow mb-5">
          Invest in <span className="text-goldenrod">Stocks</span>{" "}
          <br className="hidden sm:block" /> with confidence
        </h1>

        <ul
          className="text-lg sm:text-xl space-y-2 mb-10 text-snow max-md:text-center"
          role="list"
        >
          {FEATURES.map((itm, _idx) => (
            <li className="text-lightGray" key={_idx}>
              {itm}
            </li>
          ))}
        </ul>

        <div className="flex max-md:justify-center">
          <Link
            href="/signup"
            className="primary-btn px-6 py-3"
            role="button"
            aria-label="Sign up to start investing"
          >
            Get Started
          </Link>
        </div>
      </div>

      <Chart />
    </section>
  );
}

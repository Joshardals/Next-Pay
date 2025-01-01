import Image from "next/image";

const topRow = ["fortune", "bloomberg", "forbes"];
const bottomRow = ["nasdaq", "insider"];

export function FeaturedIn() {
  return (
    <section className="text-white flex flex-col items-center">
      <p className="text-lightGray font-light text-xl mb-8">Featured in</p>

      <div className="md:flex md:space-x-16 md:items-center max-md:flex max-md:flex-col max-md:space-y-8">
        <ul className="flex items-center space-x-16">
          {topRow.map((itm) => (
            <li key={itm}>
              <Image
                src={`/assets/${itm}.svg`}
                width={100}
                height={100}
                alt={itm}
                className="max-md:w-[80px]"
              />
            </li>
          ))}
        </ul>

        <ul className="flex items-center space-x-16 max-md:mx-auto">
          {bottomRow.map((itm) => (
            <li key={itm}>
              <Image
                src={`/assets/${itm}.svg`}
                width={100}
                height={100}
                alt={itm}
                className="max-md:w-[80px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

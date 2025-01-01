import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative">
        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="Logo"
          className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]"
          priority
        />
      </div>
      <span className="text-snow font-bold uppercase text-xl sm:text-2xl md:text-3xl whitespace-nowrap">
        Next Pay
      </span>
    </Link>
  );
}

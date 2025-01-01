import { SignupForm } from "@/app/_components/Form/SignupForm";
import Image from "next/image";

const FEATURES = [
  {
    path: "vault-gold-simple",
    label: "100% Reserve Custody",
  },
  {
    path: "clock-gold-glow",
    label: "Zero-Fee Recurring Buys",
  },
  {
    path: "nav_percent",
    label: "3.8% Interest on cash",
  },
];

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center px-4 text-[#E4E4E4] min-h-screen mb-14">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-medium text-center">Create an account</h1>

        <ul className="flex justify-between px-4">
          {FEATURES.map((itm, idx) => (
            <li
              key={idx}
              className="font-light text-sm flex flex-col items-center text-[#9B9B9B]"
            >
              <Image
                src={`/assets/${itm.path}.svg`}
                width={30}
                height={30}
                alt={itm.label}
                className="mb-2"
              />
              <span className="max-w-28 text-center">{itm.label}</span>
            </li>
          ))}
        </ul>

        <SignupForm />
      </div>
    </main>
  );
}

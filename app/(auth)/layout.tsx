import Header from "../_components/Auth/Header";
import { Footer } from "../_components/Auth/Footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[1500px] mx-auto">
      <Header />
      <main className="flex flex-col items-center justify-center mt-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}

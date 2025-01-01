import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Nex Pay | Invest in Stock with confidence",
  description: "Nex Pay | Invest in Stock with confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.variable} max-w-[1500px] mx-auto`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

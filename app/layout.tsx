import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Next Pay | Invest in Stock with confidence",
  description: "Next Pay | Invest in Stock with confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.variable} max-w-[1500px] mx-auto`}>
        {children}
      </body>
    </html>
  );
}

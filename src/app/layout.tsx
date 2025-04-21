import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";

import { Providers } from "./_components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enigma - Interactive Cryptography Tool",
  description:
    "Interactive cryptography tool featuring Enigma machine simulation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

import "~/styles/globals.css";

import { type Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import { Geist } from "next/font/google";
import { ThemeProvider } from "./_components/Providers";

export const metadata: Metadata = {
  title: "eNygma",
  description: "Note taking with a twist",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} dark`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

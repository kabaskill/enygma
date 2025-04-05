import "~/styles/globals.css";

import { type Metadata } from "next";
import { Courier_Prime } from "next/font/google";


export const metadata: Metadata = {
  title: "eNygma",
  description: "Note taking with a twist",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const courier = Courier_Prime({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-courier",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${courier.variable} dark`}>
      <body>
        {children}
      </body>
    </html>
  );
}

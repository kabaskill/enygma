import "~/styles/globals.css";

import { type Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import { Geist } from "next/font/google";
import { ThemeProvider } from "./_components/Providers";
import { AuthProvider } from "./_components/AuthContext";

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
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dracula"
            enableSystem={false}
            value={{
              light: "light",
              dark: "dark",
              dracula: "dracula",
            }}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

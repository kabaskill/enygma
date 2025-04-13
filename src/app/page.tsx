"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./_components/ui/card"; //prettier-ignore
import Demo from "./_components/Demo";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import LetterGlitch from "./_components/LetterGlitch";

export default function Home() {

  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full opacity-20">
        <LetterGlitch
          glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
          glitchSpeed={100}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
        />
      </div>

      <Header />

      <main >
        {/* Hero Section */}
        <section className="container mx-auto flex min-h-screen w-full flex-col items-center justify-center">
          <Hero />
        </section>

        {/* Demo Section */}
        <section className="container mx-auto flex min-h-screen w-full flex-col items-center justify-center">
          <Demo />
        </section>

        {/* About Section */}
        <section className="container mx-auto flex min-h-screen w-full flex-col items-center justify-between">
         
            <Card className="w-full ">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  This is a demo application showcasing the use of Next.js,
                  Tailwind CSS, and Radix UI.
                </p>
              </CardContent>
            </Card>
  

          <Footer />
        </section>
      </main>
    </>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "./_components/ui/card"; //prettier-ignore
import { cn } from "~/lib/utils";
import Demo from "./_components/Demo";
import Footer from "./_components/Footer";
import { Separator } from "./_components/ui/separator";
import Hero from "./_components/Hero";
import Header from "./_components/Header";

export default async function Home() {
  return (
    <>
      <Header />

      <main className={cn("min-h-screen", "flex flex-col items-center")}>
        <Hero />

        <Separator className="bg-secondary" />

        {/* Demo section */}
        <Card className="container my-24 w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-center">
              <h2 className="text-3xl">Test it out!</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Demo />
          </CardContent>
        </Card>

        <Separator className="bg-secondary" />

        <Footer />
      </main>
    </>
  );
}

import Link from "next/link";
import { auth } from "~/server/auth";
import { cn } from "~/lib/utils";
import Demo from "./_components/Demo";

import { Button } from "./_components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./_components/ui/card"; //prettier-ignore
import { Sparkles, Layers, LogIn, LogOut, Github, ChevronRight } from "lucide-react"; //prettier-ignore
import { Separator } from "./_components/ui/separator";

export default async function Home() {
  const session = await auth();

  return (
    <main
      className={cn(
        "min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800/90 to-zinc-900",
        "flex flex-col items-center",
      )}
    >
      {/* Hero section */}
      <section className="container px-4 pt-20 pb-12 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-amber-400" />
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
              e<span className="text-[hsl(280,100%,70%)]">N</span>ygma
            </h1>
          </div>
          <p className="max-w-[42rem] text-lg text-zinc-400 md:text-xl">
            A modern Enigma machine simulator with classic and modern
            interfaces. Experience encryption from the past with today's
            technology.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="default"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Link href="/modern">
                Try Modern UI <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <Link href="/classic">
                Try Classic UI <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="bg-zinc-800" />

      {/* Features section */}
      <section className="container px-4 py-16">
        <div className="grid grid-cols-1 place-items-center gap-6 md:grid-cols-2">
          <Card className="border-zinc-700 bg-zinc-800/50 text-zinc-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-400" />
                <CardTitle>Classic Interface</CardTitle>
              </div>
              <CardDescription className="text-zinc-400">
                Experience the historical design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                An authentic recreation of the original Enigma machine interface
                with period-appropriate styling and interactions. Perfect for
                history enthusiasts.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-amber-400 hover:bg-zinc-700/70 hover:text-amber-300"
              >
                <Link href="/classic">
                  Explore Classic <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-zinc-700 bg-zinc-800/50 text-zinc-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <CardTitle>Modern Interface</CardTitle>
              </div>
              <CardDescription className="text-zinc-400">
                A contemporary approach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                A sleek, intuitive redesign of the Enigma machine with modern UI
                principles. Features responsive design and enhanced
                visualization of the encryption process.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-purple-400 hover:bg-zinc-700/70 hover:text-purple-300"
              >
                <Link href="/modern">
                  Explore Modern <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Demo section */}
      <section className="container flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Interactive Demo
          </h2>
          <Card className="border-zinc-700 bg-zinc-800/50">
            <CardContent className="pt-6">
              <Demo />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Auth section */}
      <section className="container px-4 py-8 pb-16">
        <div className="flex flex-col items-center justify-center gap-4">
          {session ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-zinc-300">
                Logged in as{" "}
                <span className="font-medium text-white">
                  {session.user?.name}
                </span>
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <Link href="/api/auth/signout">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Link>
              </Button>
            </div>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <Link href="/api/auth/signin">
                <LogIn className="mr-2 h-4 w-4" /> Sign in
              </Link>
            </Button>
          )}
          <div className="mt-8 text-center">
            <Link
              href="https://github.com/your-username/enygma"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Repository</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

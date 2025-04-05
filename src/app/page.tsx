import Link from "next/link";
import { cn } from "~/lib/utils";

import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main
      className={cn(
        "flex min-h-screen flex-col items-center justify-center",
        "bg-gradient-to-b from-zinc-800 via-amber-800/20 to-zinc-800 text-amber-100",
      )}
    >
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          e<span className="text-[hsl(280,100%,70%)]">N</span>ygma
        </h1>
     
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/classic"
          >
            <h3 className="text-2xl font-bold">Classic UI</h3>
            <div className="text-lg">
              This is a classic UI using the Enigma component.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/modern"
          >
            <h3 className="text-2xl font-bold">Modern UI</h3>
            <div className="text-lg">
              This is a modern UI using the Enigma component.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

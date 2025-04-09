import Link from "next/link";
import { Button } from "./ui/button";
import { Github, LogIn, LogOut } from "lucide-react";

import { cn } from "~/lib/utils";
import { createClient } from "~/utils/supabase/server";
import SignOutButton from "./SignOut";


export default async function Hero() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession()
  
  let verifiedUser = null;
  if (session) {
    const { data: { user } } = await supabase.auth.getUser();
    verifiedUser = user;
  }

  return (
    <>
      <section className={cn("container px-4 pt-20 pb-12 md:pt-32 md:pb-24")}>
        <div className="flex flex-col items-center gap-12 text-center">
          <p className="max-w-[42rem] md:text-2xl">
            A modern Enigma machine simulator with classic and modern
            interfaces. Experience encryption from the past with today's
            technology.
          </p>

          <div className="flex flex-col items-center gap-2 text-xl md:flex-row">
            <p className="text-4xl">183958</p>
            <p>letters encrypted from</p>
            <p className="text-4xl">38539</p>
            <p>messages</p>
          </div>

          <div className="flex w-full max-w-xl flex-wrap items-center justify-around py-8 sm:flex-nowrap gap-4">
            <Link
              href="https://github.com/kabaskill/enygma"
              className="inline-flex items-center gap-2"
            >
              <Button size="lg" variant="outline">
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </Button>
            </Link>
            <Link
              href="https://github.com/kabaskill/enygma"
              className="inline-flex items-center gap-2"
            >
              <Button size="lg">
                <span>Get Started</span>
              </Button>
            </Link>
          </div>

          {/* AUTH SECTION */}
          <div className="flex flex-col items-center justify-center gap-4">
            {verifiedUser ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <p>
                  Logged in as{" "}
                  <span className="font-medium">{verifiedUser.email}</span>
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  <Link href="/api/auth/signout">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Link>
                </Button>

                <SignOutButton/>
              </div>
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

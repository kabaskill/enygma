"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { cn } from "~/lib/utils";
import { useAuth } from "./AuthContext";
import SignOut from "./SignOut";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import LoginForm from "./login-form";
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  const { user, loading } = useAuth();

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

          <div className="flex w-full max-w-xl flex-wrap items-center justify-around gap-4 py-8 sm:flex-nowrap">
            <Link
              href="https://github.com/kabaskill/enygma"
              className="inline-flex items-center gap-2"
            >
              <Button size="lg" variant="outline">
                <FaGithub className="h-4 w-4" />
                GitHub Repository
              </Button>
            </Link>
            <Link
              href="/modern"
              className="inline-flex items-center gap-2"
            >
              <Button size="lg">Get Started</Button>
            </Link>
          </div>

          {/* AUTH SECTION */}

          <div>
            <p>
              {loading ? "Loading..." : user ? "Logged in" : "Not logged in"}
            </p>
            <SignOut />
          </div>

          <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Welcome back!</DialogTitle>
                <DialogDescription>
                  Login with your Apple or Google account
                </DialogDescription>
              </DialogHeader>
              <LoginForm />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}

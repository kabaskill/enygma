"use client";
import { cn } from "~/lib/utils";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { useState } from "react";
import { createClient } from "~/utils/supabase/client";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();

  async function signInWithEmail() {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async function signInWithOAuth(provider: "discord" | "github" | "google") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signInWithEmail} className="grid gap-6">
            
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signInWithOAuth("discord")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.385-.403.8-.548 1.17-1.658-.25-3.295-.25-4.92 0-.145-.37-.347-.785-.557-1.17a.077.077 0 0 0-.079-.036 23.834 23.834 0 0 0-4.884 1.491.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .03.05 24.059 24.059 0 0 0 7.225 3.656.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 15.896 15.896 0 0 1-2.264-1.078.077.077 0 0 1-.008-.127c.152-.113.304-.232.448-.353a.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.144.12.296.24.448.353a.077.077 0 0 1-.006.127 14.9 14.9 0 0 1-2.264 1.078.077.077 0 0 0-.041.106c.36.7.772 1.366 1.225 1.995a.076.076 0 0 0 .084.028 23.977 23.977 0 0 0 7.233-3.656.077.077 0 0 0 .032-.05c.5-5.177-.838-9.674-3.549-13.442a.061.061 0 0 0-.031-.028z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign in with Discord
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
          
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

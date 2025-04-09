"use client";

import { createClient } from "~/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function SignOut() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut /> Sign Out
    </Button>
  );
}

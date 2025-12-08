"use client"

import { signOutAction } from "@/app/actions";
import { authLogout } from "@/redux/features/auth/authSlice";
import { userLogout } from "@/redux/features/user/userSlice";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/redux/store";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  supabase.auth.getUser().then(u => setUser(u.data.user))

  // Clear credential on the client's browser, then logout from the server
  const clientSignoutWrapper = async () => {
    dispatch(userLogout(null))
    dispatch(authLogout(null))
    await signOutAction()
    router.push('/sign-in')
  }

  return user ? (
    <div className="hidden md:flex items-center gap-4">
      Hey, {user.email}!
      <form action={clientSignoutWrapper}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}

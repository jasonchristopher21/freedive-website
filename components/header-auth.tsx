"use client"

import { signOutAction } from "@/app/actions";
import { authLogout } from "@/redux/features/auth/authSlice";
import { userLogout } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { Button } from "./ui/button";

export default function AuthButton() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user)

  // Clear credential on the client's browser, then logout from the server
  const clientSignoutWrapper = async () => {
    // Do not need to push router, let dispatch handle it downstream
    dispatch(userLogout(null))
    dispatch(authLogout(null))
    await signOutAction()
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

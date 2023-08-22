"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";


export default function AuthButton() {
  const { data: session } = useSession();
  if(session && session.user) {
    return (
      <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{session.user.username}</h3>
      <Button onClick={() => signOut()}> Sign out</Button>
      </>
    )
  } else {
    return (
      <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Sign in</h3>
      <Button asChild><Link href="/login">Sign in</Link></Button>
      </>
    )
  }
}
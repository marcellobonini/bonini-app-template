"use client"
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react"; 

interface Props {
  children: ReactNode;
}

export default function Providers({children}:Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}
"use client"

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function SettingsSideBar() {
  const linkClasses = "hover:bg-transparent hover:underline px-2 py-1"
  return (
    <section className="w-1/4 h-full flex flex-col justify-between">
      <nav>
        <ul>
          <li className={linkClasses}><Link href="/settings">Account</Link></li>
          <li className={linkClasses}><Link href="/settings">Terms of service</Link></li>
        </ul>
      </nav>
      <div>
        <Link className="flex flex-row items-center text-muted-foreground hover:underline" href="/goals"><ArrowLeftIcon/> Go back</Link>
      </div>
    </section>
  )
}
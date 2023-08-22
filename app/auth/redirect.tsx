import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

export default function RedirectAuth() {
  redirect("/app/auth/redirect?youshouldchangethisfile=yes");
  return (
    <Skeleton className="w-1/2 h-1/2"/>
  )
}
import { Separator } from "@/components/ui/separator"
import SettingsSideBar from "./sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen max-h-screen w-screen flex flex-col p-10">
      <header>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Settings
      </h3>
      <p className="text-md text-muted-foreground">
        Change your account details.
      </p>
      <Separator className="w-full my-6"/>
      </header>
      <main className="max-h-full w-full flex flex-row overflow-y-hidden">
        <SettingsSideBar/>
        {children}
        <Toaster/>
      </main>
    </div>
  )
}
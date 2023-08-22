"use client"
import Image from 'next/image'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import { FrameIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Separator } from "@/components/ui/separator"
import { useTheme } from 'next-themes'

export default function Home() {
  const { setTheme } = useTheme()
  return (
    <div className='flex flex-col h-screen'>
      <header className="sticky top-0 z-40 w-full h-14 border-b backdrop-blur-sm flex flex-row items-center">
      <div className="flex flex-row container justify-between">
        <div className="flex flex-row items-center">
          <Link href="/" className="flex flex-row mr-4">
          <FrameIcon className="h-6 w-6 mr-2"/><h1 className="font-bold">Your app&apos;s name</h1>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                <Link href="/">How does it work?</Link>
            </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="space-x-2">
            <Separator orientation="vertical" className="h-5 mr-2"/>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
      <main className="flex flex-col h-full snap-y snap-mandatory p-24">
        <section className='flex h-full flex-row snap-center items-center justify-evenly'>
          <Image 
            src=""
            alt='put here cool photo'
            width={450}
            height={570}
            className='rounded-lg'
          />
          <div className='flex flex-col text-center items-center'>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Your own header</h1>
            <p>Lorem ipsum.</p>
            <Button asChild className='w-48 mt-4'>
              <Link href="/auth">Getting started</Link>  
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrameIcon } from "@radix-ui/react-icons";
import Login from "./login";
import Register from "./register";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import RedirectAuth from "./redirect";

export default function Auth() {
  const {data:session} = useSession();
  return(
    <main className="flex flex-row h-screen">
      <section className="h-full w-1/2 dark:bg-cover dark:bg-right dark:bg-rome bg-gradient-to-r from-violet-500 to-background">
        <div className="flex h-full flex-col backdrop-blur-md">
          <div className="h-1/2 flex flex-row justify-start p-12">
            <div className="flex flex-row h-min items-center">
              <FrameIcon className="h-8 w-8 mr-1"/>
              <h1 className="text-3xl">Bonini&apos;s template</h1>
            </div>
          </div>
          <div className="h-1/2 flex flex-col justify-end p-12">
            <p>{"funny monke"}</p>
            <span>- Christopher Nolan</span>
          </div>
        </div>
      </section>
      <section className="h-full w-1/2 flex flex-col justify-center items-center">
        <div className="w-1/2">
          {!session ? (
            <Tabs defaultValue="login" className="max-w-[450px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>
                      Log in to your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Login/>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                      Create your own personal account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Register/>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <RedirectAuth/>
          )}
         
        </div>
      </section>
    </main>
    )
}
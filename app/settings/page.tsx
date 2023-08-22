"use client"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordChangeForm from "./password-change-form";
import { Button } from "@/components/ui/button";
import { AlertDialog,  AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import UsernameChangeForm from "./username-change-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  confirm: z.string().min(1, {message:"You must confirm your request."}),
})

function envCheck() {
  const env = process.env.NODE_ENV
  if(env == "development"){
    return "http://localhost:3000"
  }
  else if (env == "production"){
   return "https://goals-virid.vercel.app" //production url:]
  }
}

export default function Account() {
  const {data: session} = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(values.confirm === "delete my account") {
      let userId = session?.user.id
      const res = await axios.delete(envCheck()+"/api/user/"+`${userId}`, 
      {
        headers: {authorization: session?.user.accessToken}
      });
      if(res.status === 200) signOut();
    } else {
      form.setError("confirm", {message:"Confirmation is incorrect"})
    }
  }

  return(
    <ScrollArea className="w-3/4 h-full">
        <div>
          <UsernameChangeForm/>
        </div>
        <div className="mt-8">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Change password
          </h4>
          <p className="text-sm text-muted-foreground">Update your password using your old password.</p>
          <div className="w-1/2 mt-4">
            <PasswordChangeForm/>
          </div>
        </div>
        <div className="w-1/2 mt-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Delete your account</CardTitle>
              <CardDescription>Sad option to delete your account.</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-row-reverse">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-destructive">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To confirm type <strong className="text-destructive">delete my account</strong></FormLabel>
                            <FormControl>
                              <Input className="font-semibold border-destructive" placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />     
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" variant="destructive">Delete</Button>
                      </AlertDialogFooter>
                    </form>
                  </Form>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
    </ScrollArea>
  )
}
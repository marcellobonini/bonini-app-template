"use client"
 
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeClosedIcon, EyeOpenIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button"
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

function envCheck() {
  const env = process.env.NODE_ENV
  if(env == "development"){
    return "http://localhost:3000"
  }
  else if (env == "production"){
   return "https://goals-virid.vercel.app" //production url:]
  }
}

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Nickname must have at least 3 charactes."
  }),
});

export default function UsernameChangeForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const {data: session, update} = useSession();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user.username
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    let userId = session?.user.id;
    let userEmail = session?.user.email
    const res = axios.patch(envCheck()+"/api/user/"+`${userId}`,
    {
      data: {
        email: userEmail,
        username: values.username
      }
    },{
      headers: {authorization: session?.user.accessToken}
    });
    if ((await res).data === "200") {
      setIsProcessing(false);
      await update({
        user: {
          ...session?.user,
          username: values.username
        }
      });
      toast({
        title: "Update successful",
        variant: "success"
      });
    } else {
      console.error("Nickname update error");
    }
  }

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Change your nickname
      </h4>
      <p className="text-sm text-muted-foreground">Update your nickname.</p>
      <div className="w-1/2 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" 
                          type="text" 
                          autoCapitalize="none" 
                          autoComplete="username" 
                          autoCorrect="off" 
                          {...field} 
                        />
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>     
            <div className="flex justify-end items-center space-x-2 mt-6">
              <Button type="submit" onClick={() => setIsProcessing(true)}>
              {!isProcessing ? 
                ("Update nickname") : (<UpdateIcon className="animate-spin"/>)
              }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
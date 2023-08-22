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

const env = process.env.NODE_ENV;

function envCheck() {
  if(env == "development"){
    return "http://localhost:3000"
  }
  else if (env == "production"){
   return "https://goals-virid.vercel.app" //production url:]
  }
}

const formSchema = z.object({
  // username: z.string(),
  oldPassword: z.string(),
  newPassword: z.string().min(8, {
    message: "Password must have at lest 8 characters."
  }),
  confirmPassword: z.string().min(1, {
    message: "You must confirm your password."
  })
})
.refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "New password and password confirmation don't match.",
});

export default function PasswordChangeForm() {
  const [passType, setPassType] = useState("password");
  const [isProcessing, setIsProcessing] = useState(false);
  const {data: session} = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let userId = session?.user.id;
    let userEmail = session?.user.email
    const res = axios.patch(envCheck()+"/api/user/"+`${userId}`,
    {
      data: {
        email: userEmail,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      }
    },{
      headers: {authorization: session?.user.accessToken}
    });
    if((await res).data === "401") {
      form.setError("oldPassword", {message: "Incorrect password"});
      setIsProcessing(false);
    }
    if ((await res).data === "200") {
      setIsProcessing(false);
      toast({
        title: "Update successful",
        variant: "success"
      });
    }
    if((await res).data === "404") {
      form.setError("oldPassword", {message: "Session error"});
      setIsProcessing(false);
    }
    if(env == "development"){
      console.log(values);
      console.log((await res).data);
    }    
  }

  function passwordType() {
      if(passType === "password") {
        return "password"
      } else return "text"
  }

  function showPasswordButton() {
    if(passType === "password") {
      return <Button type="button" variant="secondary" className="ml-2" onClick={() => setPassType("text")}><EyeClosedIcon/></Button>
    } else {
      return <Button type="button" variant="secondary" className="ml-2" onClick={() => setPassType("password")}><EyeOpenIcon/></Button>
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <div className="flex flex-row">
                    <FormControl>
                      <Input placeholder="old password" 
                        type={passwordType()} 
                        autoCapitalize="none" 
                        autoComplete="password" 
                        autoCorrect="off" 
                        {...field} 
                      />
                    </FormControl>
                    {showPasswordButton()}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input placeholder="new password" 
                        type={passwordType()} 
                        autoCapitalize="none" 
                        autoComplete="password" 
                        autoCorrect="off" 
                        {...field} 
                      />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input placeholder="confirm new password" 
                        type={passwordType()} 
                        autoCapitalize="none" 
                        autoComplete="password" 
                        autoCorrect="off" 
                        {...field} 
                      />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>     
        <div className="flex justify-end items-center space-x-2 mt-6">
          <Button type="submit" onClick={() => setIsProcessing(true)}>
          {!isProcessing ? 
            ("Update password") : (<UpdateIcon className="animate-spin"/>)
          }
          </Button>
        </div>
      </form>
    </Form>
  )
}
"use client"
 
import Link from "next/link"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeClosedIcon, EyeOpenIcon, FrameIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button"
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { useForm } from "react-hook-form";
import { useState } from "react";
import { SignInResponse, signIn, signOut } from "next-auth/react";

const env = process.env.NODE_ENV;

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export default function Login() {
  const [passType, setPassType] = useState("password");
  const [isProcessing, setIsProcessing] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();
    signIn("credentials", { email: values.email, password: values.password, redirect: false })
    .then((response:SignInResponse | undefined) => {
      if(response?.error !== null) {
        if(response?.error === "401") {
          form.setError("password", {message: "Incorrect password"});
          setIsProcessing(false);
        }
        if (response?.error === "404") {
          form.setError("email", {message: "User not found"});
          setIsProcessing(false);
        }
        if(env === "development") {
          console.log(response);
          console.log(values);
        }
      }})
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" 
                    type="email"
                    autoCapitalize="none" 
                    autoComplete="email" 
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="flex flex-row">
                  <FormControl>
                    <Input placeholder="password" 
                      type={passwordType()} 
                      autoCapitalize="none" 
                      autoComplete="password" 
                      autoCorrect="off" 
                      {...field} 
                    />
                  </FormControl>
                  {showPasswordButton()}
                </div>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end items-center space-x-2 mt-6">
          <Button variant="outline" type="button" asChild ><Link href="/">Back</Link></Button>
          <Button type="submit" onClick={() => setIsProcessing(true)}>
            {!isProcessing ? 
              ("Log in") : (<UpdateIcon className="animate-spin"/>)
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}
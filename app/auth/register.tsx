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
import axios from "axios";

const env = process.env.NODE_ENV;

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  repassword: z.string().min(1, {
    message: "You must confirm your password."
  })
})
.refine((data) => data.password === data.repassword, {
  path: ["repassword"],
  message: "Password and password confirmation aren't the same.",
});

export default function Register() {
  const [passType, setPassType] = useState("password");
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    const response = await axios.post('/api/user/', {
      data: {
        email: values.email,
        password: values.password
      }
    });
    const userInfo = await response;
    if(userInfo.status === 200) {
      window.location.reload();
    }
    if(env === "development") {
      console.log(values);
      console.log(userInfo);
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your email?</FormLabel>
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
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create a secure password</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="confirm password" 
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
          <Button variant="outline" type="button" asChild ><Link href="/">Back</Link></Button>
          <Button type="submit">
            {!isProcessing ? ("Create") : (<UpdateIcon className="animate-spin"/>)}
          </Button>
        </div>
      </form>
    </Form>
  )
}
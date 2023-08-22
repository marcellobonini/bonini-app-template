import type { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

function envCheck() {
  const env = process.env.NODE_ENV
  if(env == "development"){
    return "http://localhost:3000"
  }
  else if (env == "production"){
   return "https://goals-virid.vercel.app" //production url:]
  }
}

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {label: "email", type:"email", placeholder: "name@example.com"},
        password: {label: "password", type: "password", placeholder:"password"}
      },
      async authorize(credentials) {
        const res = await fetch(envCheck()+"/api/login", {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          })
        });
        console.log("response from authorize",res); // Will show you the status
        if(res.status === 200) {
          const user = res.json();
          return user;
        } else {
          throw new Error(""+res.status);
        }
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth',
    signOut: '/'
  },
  callbacks: {
    async jwt({token, user, trigger, session}) {
      if(trigger === "update") {
        return {...token, ...session.user}
      }
      return({...token, ...user})
    },
    async session({session, token}) {
      session.user = token as any;
      return session;
    }
  }
}
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function DELETE(request:Request, {params}:{params:{id:number}}) {
  const accessToken = request.headers.get("authorization")
  if(!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({
      error: "unauthorized"
    }),
    {status:401})
  };
  const deleteUser = await prisma.user.delete({
    where: {
      id: +params.id
    },
  })
  return NextResponse.json(deleteUser);
}

interface RequestBody {
  data: {
    username:string;
    email:string,
    oldPassword:string,
    newPassword:string,
  }
}

export async function PATCH(request:Request, {params}:{params:{id:number}}) {
  const accessToken = request.headers.get("authorization")
  if(!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({
      error: "unauthorized"
    }),
    {status:401})
  };
  const body:RequestBody = await request.json();
  if(body.data.username !== "") {
    const setUsername = await prisma.user.update({
      where: {
        id: +params.id
      },
      data: {
        username: body.data.username
      }
    });
    return NextResponse.json("200");
  } else {
    const user = await prisma.user.findFirst({
      where: {
        email: body.data.email,
      }
    });
    if(!user) return NextResponse.json("404");
    if(await bcrypt.compare(body.data.oldPassword, user?.hashedPassword)) {
      const updatePassword = await prisma.user.update({
        where: {
          id: +params.id
        },
        data: {
          hashedPassword: await bcrypt.hash(body.data.newPassword, 10)
        }
      });
      return NextResponse.json("200");
    } else {
      return NextResponse.json("401");
    }
  }
}

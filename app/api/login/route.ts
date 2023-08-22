import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface RequestBody {
  email: string;
  password: string;
}
export async function POST(request: Request) {
  const body:RequestBody = await request.json();
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    }
  });
  if(user) {
    if(await bcrypt.compare(body.password, user.hashedPassword)) {
      const {hashedPassword, ...userWithoutPassword} = user;
      const accessToken = signJwtAccessToken(userWithoutPassword);
      const result = {
        ...userWithoutPassword,
        accessToken,
      }
      console.log(result);
      return NextResponse.json(result);
    } else {
      console.log("incorrect password");
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
  } else {
    console.log("no user found");
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
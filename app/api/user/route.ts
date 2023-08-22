import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

interface RequestBody {
  data: {
    username: string;
    email: string;
    password: string;
  }
}
export async function POST(request: Request) {
  const body:RequestBody = await request.json();
  const user = await prisma.user.create({
    data: {
      // username: body.username,
      email: body.data.email,
      hashedPassword: await bcrypt.hash(body.data.password, 10),
    }
  });
  const {hashedPassword, ...result} = user;
  return new Response(JSON.stringify(result));
}
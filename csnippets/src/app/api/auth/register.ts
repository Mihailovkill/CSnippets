import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerUserSchema = z.object({
  username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, "Invalid username"),
  email: z
    .string()
    .regex(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g, "Invalid e-mail adress"),
  password: z.string().min(5, "Password should be minimum 5 characters"),
});

const prisma = new PrismaClient();

export default async function registerUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, email, password } = registerUserSchema.parse(req.body);
  const user = await prisma.user.findUnique({
    where: { username, email },
  });
  if (user !== null) {
    return res.send({ user: null, message: "User already exists" });
  } else if (email !== null) {
    return res.send({ email: null, message: "E-mail is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return res.send({ user: newUser, message: "User created succesfully" });
}

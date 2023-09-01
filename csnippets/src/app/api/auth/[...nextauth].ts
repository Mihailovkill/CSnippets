import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

const loginUserSchema = z.object({
  username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, "Invalid username"),
  password: z.string().min(5, "Password should be minimum 5 characters"),
});

const prisma = new PrismaClient();

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          type: "text",
          placeholder: "Username",
        },
        password: {
          type: "password",
          placeholder: "pa$$w0rd",
        },
      },
      async authorize(credentials, req) {
        const { username, password } = loginUserSchema.parse(credentials);
        const user = await prisma.user.findUnique({
          where: { username },
        });
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;
        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);

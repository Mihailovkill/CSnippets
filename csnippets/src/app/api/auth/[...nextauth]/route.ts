import NextAuth, { Awaitable, RequestInternal, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "csnippets",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
      },
      authorize: function (
        credentials: Record<"email", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Awaitable<User | null> {
        throw new Error("Function not implemented.");
      },
    }),
  ],
});

export { handler as GET, handler as POST };

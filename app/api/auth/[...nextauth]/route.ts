import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";

import prisma from "@/prisma/client";
import { JWT } from "next-auth/jwt";

interface SessionUser {
  id: number;
  image: string;
  provider: string;
  admin: boolean;
}

async function getDatabaseId(user: JWT) {
  try {
    if (user.email) {
      const queryResult = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          image: true,
          provider: true,
          admin: true,
        },
      });

      if (queryResult) {
        return [
          queryResult.id,
          queryResult.image,
          queryResult.provider,
          queryResult.admin,
        ];
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user ID from the database:", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.password) {
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
        }

        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    session: async ({ session, token }) => {
      const databaseId = await getDatabaseId(token);

      if (databaseId !== null && databaseId !== undefined) {
        return {
          ...session,
          user: {
            ...session.user,
            id: databaseId[0] as number,
            image: databaseId[1] as string,
            provider: databaseId[2] as string,
            admin: databaseId[3] as boolean,
          } as SessionUser,
        };
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as any;
        return { ...token, id: user.id };
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const data = {
          name: user.name,
          email: user.email,
          password: user.id,
          provider: "Google",
        };

        try {
          const response = await fetch("http://localhost:3000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          });
        } catch (error) {
          console.log(error);
        }
      }
      return user;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

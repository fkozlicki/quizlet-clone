import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
// import AppleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { encode, decode } from "next-auth/jwt";
import Cookies from "cookies";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = requestWrapper(req, res);
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return await NextAuth(...data);
};

export default handler;

export function requestWrapper(
  req: NextApiRequest,
  res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
  const generateSessionToken = () => randomUUID();

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);

  const adapter = PrismaAdapter(prisma);

  const opts: NextAuthOptions = {
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        // Include user.id on session
        if (session.user) {
          session.user.id = user.id;
        }

        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionMaxAge = 60 * 60 * 24 * 30; // 30 Days
            const sessionExpiry = fromDate(sessionMaxAge);

            adapter.createSession &&
              (await adapter.createSession({
                sessionToken: sessionToken,
                userId: user.id,
                expires: sessionExpiry,
              }));

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }

        return true;
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      FacebookProvider({
        clientId: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
      }),
      CredentialsProvider({
        id: "credentials",
        name: "credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "example@email.com",
          },
          password: {
            label: "Password",
            type: "password",
            placeholder: "*****",
          },
        },
        authorize: async (credentials) => {
          if (!credentials) return null;

          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });

          if (!user) return null;

          if (!user.password) return null;

          const isValidPassword = await compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) return null;

          return user;
        },
      }),
    ],
  };

  return [req, res, opts];
}

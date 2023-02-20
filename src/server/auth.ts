import type {
  NextApiRequest,
  NextApiResponse,
  GetServerSidePropsContext,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { requestWrapper } from "../pages/api/auth/[...nextauth]";

/**
 * Wrapper for unstable_getServerSession, used in trpc createContext and the
 * restricted API route
 *
 * Don't worry too much about the "unstable", it's safe to use but the syntax
 * may change in future versions
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const getServerAuthSession = async (ctx: {
  // req: GetServerSidePropsContext["req"];
  // res: GetServerSidePropsContext["res"];
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return await unstable_getServerSession(...requestWrapper(ctx.req, ctx.res));
};

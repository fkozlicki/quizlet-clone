import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "../api/root";
import { getServerAuthSession } from "../auth";
import { prisma } from "../db";

export const createSSRHelper = async () => {
  const session = await getServerAuthSession();
  return createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      session,
    },
    transformer: superjson,
  });
};

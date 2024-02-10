import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../api/root";
import { prisma } from "../db";
import superjson from "superjson";
import type { Session } from "next-auth";

export const generateSSGHelper = (session: Session | null = null) => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session },
    transformer: superjson, // optional - adds superjson serialization
  });
};

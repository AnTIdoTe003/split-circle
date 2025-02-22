import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { AppContext } from "@/pages/api/trpc/[trpc]";

const t = initTRPC.context<AppContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

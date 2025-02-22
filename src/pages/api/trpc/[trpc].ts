// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/server/routers/_app";
import type { NextApiRequest, NextApiResponse } from "next";

// Create the context type for Next.js
const createContext = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => ({
  req,
  res,
});

export type AppContext = typeof createContext;

export default createNextApiHandler({
  router: appRouter,
  createContext,
});

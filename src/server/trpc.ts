import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { inferProcedureOutput } from '@trpc/server';

const t = initTRPC.context<{}>().create({
    transformer: superjson,
});

export const createContext = ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => ({ req, res });
export type Context = ReturnType<typeof createContext>;

export const trpc = t;
export type inferQueryResponse<TRouteKey extends keyof tRouter['_def']['queries']> = inferProcedureOutput<tRouter['_def']['queries'][TRouteKey]>;

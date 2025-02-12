import { trpc } from '../trpc';
import { authRouter } from './authRouter';

export const appRouter = trpc.router({
    auth: authRouter,
});

export type AppRouter = typeof appRouter;

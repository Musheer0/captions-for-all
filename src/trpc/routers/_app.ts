import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { VideoRouters } from './video-routers';
 
export const appRouter = createTRPCRouter({
  video:VideoRouters
});
 
// export type definition of API
export type AppRouter = typeof appRouter;
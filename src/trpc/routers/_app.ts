import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { VideoRouters } from './video-routers';
import { CaptionsRouter } from './captions-router';
 
export const appRouter = createTRPCRouter({
  video:VideoRouters,
  captions:CaptionsRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;
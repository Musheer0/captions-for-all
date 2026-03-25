import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { VideoRouters } from './video-routers';
import { CaptionsRouter } from './captions-router';
import { ClipsRouter } from './clips-router';
 
export const appRouter = createTRPCRouter({
  video:VideoRouters,
  captions:CaptionsRouter,
  clips:ClipsRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;
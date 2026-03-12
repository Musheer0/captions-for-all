import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson'
export const createTRPCContext = cache(async () => {}); 
const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async({next,ctx})=>{
    const session = await auth()
    if(!session.userId) throw new TRPCError({code:"UNAUTHORIZED"})
    return next({ctx:{...ctx,session}})
})
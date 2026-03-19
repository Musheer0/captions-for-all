import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { extractCaptionsFromVideo } from "@/inngest/functions/extract-captions-from-video";
import { burnCaptionsToVideo } from "@/inngest/functions/burn-captions-to-video";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    extractCaptionsFromVideo,
    burnCaptionsToVideo
  ],
});
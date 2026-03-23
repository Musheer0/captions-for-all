import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { extractCaptionsFromVideo } from "@/inngest/functions/extract-captions-from-video";
import { burnCaptionsToVideo } from "@/inngest/functions/burn-captions-to-video";
import { sendEmailFunction } from "@/inngest/functions/send-email-function";
import { clipVideo } from "@/inngest/functions/clip-video";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    extractCaptionsFromVideo,
    burnCaptionsToVideo,
    sendEmailFunction,
    clipVideo
  ],
});
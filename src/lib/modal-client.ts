import { paths } from "@/types/modal-api";
import createClient from "openapi-fetch";
export const modalClient = createClient<paths>({
    baseUrl:process.env.API_URL,
    headers:{
        "x-internal-key":process.env.BACKEND_API_KEY
    }
})
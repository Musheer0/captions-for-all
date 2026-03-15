import { createId, isCuid } from "@paralleldrive/cuid2";
export const generateObjectKey = (id:string,)=> `users/${id}/videos/${createId()}`
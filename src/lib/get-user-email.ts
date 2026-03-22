import { clerkClient } from "@clerk/nextjs/server";

export async function getUserEmail(userId: string) {
  const client = await clerkClient(); // ← THIS is the fix

  const user = await client.users.getUser(userId);

  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  return email;
}
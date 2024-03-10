import { auth } from "$lib/firebase/admin";
import { redirect, type Handle } from "@sveltejs/kit";
import type { DecodedIdToken } from "firebase-admin/auth";

async function decodeToken(token?: string): Promise<DecodedIdToken | null> {
  if (!token || token === "null" || token === "undefined") return null
  try {
    return await auth.verifyIdToken(token);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  console.log(`New request running from ${event.url.pathname}`);
  console.log(`hooks.server.ts`);

  // Retrieve and decode the user ID token
  const token = event.cookies.get("token");
  const decodedToken = await decodeToken(token);
  console.log(decodedToken);
  
  // if (decodedToken) {
  //   event.cookies.serialize("user", JSON.stringify(decodedToken) ?? "", {
  //     path: "/",
  //     maxAge: decodedToken ? undefined : 0,
  //   });
  // }

  // If not authorized, do not allow to visit application routes
  // if (!access && (event.route.id?.startsWith("/(app)") || event.route.id?.startsWith("/(auth)"))) {
  //   throw redirect(303, "/login");
  // }

  // If authorized, do not allow to visit authentication routes
  // if (access && event.route.id?.startsWith("/(auth)")) {
  //   return redirect(303, "/");
  // }

  // Load page as normal
  // console.log(event);
  console.log(`Page is ready. Sending the response.`);
  const response = resolve(event);
  return response;
}
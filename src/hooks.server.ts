import { auth } from "$lib/firebase/admin";
import { type Handle } from "@sveltejs/kit";
import type { DecodedIdToken } from "firebase-admin/auth";

function redirect(location: string, body?: string) {
  return new Response(body, {
    status: 303,
    headers: { location }
  })
}

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

  if (decodedToken) {
    // Add the decoded token as custom data to the request,
		// which is passed to handlers in +server.js and server load functions
    event.locals.user = decodedToken.uid;
  }

  // Check if the request is trying to access restricted routes without authorization
  if (!decodedToken && (event.url.pathname === "/garage" || event.url.pathname === "/profile")) {
    return redirect("/login");
  }

  // Load page as normal
  console.log(event);
  console.log(`Page is ready. Sending the response.`);
  const response = resolve(event);
  return response;
}
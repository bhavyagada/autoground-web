import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  console.log(`New request running from ${event.url.pathname}`);
  const token = event.cookies.get("token");

  // If not authorized, do not allow to visit application routes
  if (!token && (event.route.id?.startsWith("/garage") || event.route.id?.startsWith("/search"))) {
    throw redirect(303, "/login");
  }

  // If authorized, do not allow to visit authentication routes
  if (token && event.route.id?.startsWith("/login")) {
    return redirect(303, "/");
  }

  // Load page as normal
  const response = resolve(event);
  return response;
}
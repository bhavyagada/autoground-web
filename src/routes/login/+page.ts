import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "Login | Xcelerate",
    content: "Login for all car enthusiasts to book, create, and view car events."
  }
}

import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "User Profile | Xcelerate",
    content: "Update your profile details and stay up-to-date."
  }
}

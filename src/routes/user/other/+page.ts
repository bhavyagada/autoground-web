import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "Other User's Details | Xcelerate",
    content: "View someone else's details and their virtual garage. View their vehicles and their modifications."
  }
}

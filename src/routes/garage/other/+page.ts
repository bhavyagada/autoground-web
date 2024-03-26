import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "Other User's Garage | Xcelerate",
    content: "View someone else's virtual garage. View their vehicles and their modifications."
  }
}

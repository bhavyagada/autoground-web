import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "My Garage | Xcelerate",
    content: "Build your virtual garage. Add vehicles and their modifications to earn points."
  }
}

import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "Car Details | Xcelerate",
    content: "View and edit your car details. Add and edit modifications to earn additional points."
  }
}

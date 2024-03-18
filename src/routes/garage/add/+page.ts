import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "Add vehicle | Xcelerate",
    content: "Add your vehicle details like its type, image, year, make and model."
  }
}

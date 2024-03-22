import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    title: "Search | Xcelerate",
    content: "Search for people, vehicles or events all in one place."
  }
}

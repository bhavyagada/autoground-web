import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
  return {
    title: "Verification | Xcelerate",
    content: "Verify your credentials to get access to the Xcelerate platform."
  }
}

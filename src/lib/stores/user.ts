import { browser } from "$app/environment";
import { AuthenticationType, type UserData } from "$lib/types";
import { writable } from "svelte/store";

export const defaultUser = {
  created: 0,
  modified: 0,
  userId: "",
  userPhoto: "",
  name: "",
  userName: "",
  email: "",
  phone: "",
  countryCode: "",
  bio: "",
  authenticationType: AuthenticationType.phone,
  points: 0,
  specialTag: "",
  privacy: {
    hideModificationCount: true,
    hideModifications: true,
    hidePoints: true
  },
  rights: ["user"],
  cars: [],
  badges: []
}

let user = null;
if (browser) {
  const storedUser: any = sessionStorage.getItem("user");
  user = JSON.parse(storedUser);
}
export const userStore = writable<UserData>(user ? user : defaultUser);
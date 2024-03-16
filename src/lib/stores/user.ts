import { writable } from "svelte/store"
import { AuthenticationType, type UserData } from "../../types"
import { browser } from "$app/environment";

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

let user: any;
if (browser) {
  const oldData: any = sessionStorage.getItem("user");
  user = JSON.parse(oldData);
}
export const userStore = writable<UserData>(user ? user : defaultUser);

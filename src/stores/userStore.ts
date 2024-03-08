import { writable } from "svelte/store"
import { AuthenticationType } from "../types"
import { browser } from "$app/environment"

interface privacyData {
  hideModifications: boolean,
  hidePoints: boolean
}

interface userStore {
  created: number | null,
  modified: number | null,
  userId: string | null,
  userPhoto: string | null,
  name: string | null,
  userName: string | null,
  email: string | null,
  phone: string | null,
  countryCode: string | null,
  bio: string | null,
  authenticationType: string | null,
  points: number | null,
  specialTag: string | null,
  privacy: privacyData | null,
  rights: string[] | null,
  cars: string[] | null,
  badges: string[] | null
}

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
    hideModifications: true,
    hidePoints: true
  },
  rights: ["user"],
  cars: [],
  badges: []
}

let localUserData;
if (browser) {
  localUserData = window.sessionStorage.getItem("user")
}
export const userStore = writable<userStore>(localUserData ? JSON.parse(localUserData) : defaultUser);

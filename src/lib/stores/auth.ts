import { get, writable } from "svelte/store";
import { auth } from "$lib/firebase/client";
import { RecaptchaVerifier, signInWithPhoneNumber, signOut, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { AuthenticationType, type AuthData, type PhoneVerificationData, type ToastData, type UserData } from "$lib/types";
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

// authentication state stores
let user = null;
let isLoggedIn: boolean = false;
if (browser) {
  const storedUser: any = sessionStorage.getItem("user");
  user = storedUser ? JSON.parse(storedUser) : null;
  isLoggedIn = sessionStorage.getItem("loggedin") === "true";
}
export const authData = writable<AuthData>({ user, isLoggedIn });
export const userStore = writable<UserData>(user ? user : defaultUser);
export const phoneConfirmationStore = writable<PhoneVerificationData | null>(null);

export const toast = writable<ToastData | null>(null);
export const addToast = (type: string, message: string) => {
  toast.set({ type, message });
  setTimeout(dismissToast, 5000);
};
export const dismissToast = () => toast.set(null);

export async function phoneSignup(phoneNumber: string) {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, new RecaptchaVerifier(auth, "recaptcha-container", {}));
    phoneConfirmationStore.set({ confirmation: confirmationResult, phoneNumber: phoneNumber });
  } catch (error) {
    console.error(error);
  }
}

export async function resendCodeSignUp(phoneNumber: string) {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, new RecaptchaVerifier(auth, "verify-recaptcha-container", {}));
    console.log(confirmationResult);
    phoneConfirmationStore.set({ confirmation: confirmationResult, phoneNumber: phoneNumber });
  } catch (error) {
    console.error(error);
  }
}

export async function phoneVerify(code: string) {
  const confirmationResult = get(phoneConfirmationStore);
  if(!confirmationResult) return;
  if (!confirmationResult.confirmation) return;
  return confirmationResult.confirmation.confirm(code);
}

export async function googleSignup() {
  return await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function appleSignup() {
  return await signInWithPopup(auth, new OAuthProvider("apple.com"));
}

export async function logout() {
  return await signOut(auth);
}

import { get, writable } from "svelte/store";
import { browser } from "$app/environment";
import { auth } from "$lib/firebase/client";
import { RecaptchaVerifier, signInWithPhoneNumber, signOut, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { AuthenticationType, type AuthData, type PhoneVerificationData, type ToastData, type UserData } from "$lib/types";

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
let userAuth = { user: null, isLoggedIn: false };
let user = defaultUser;
let otheruser = null;
if (browser) {
  const storedUserAuth: string | null = localStorage.getItem("auth");
  const storedUser: string | null = localStorage.getItem("user");
  const storedOtherUser: string | null = localStorage.getItem("otheruser");
  userAuth = storedUserAuth ? JSON.parse(storedUserAuth) : userAuth;
  user = storedUser ? JSON.parse(storedUser) : user;
  otheruser = storedOtherUser ? JSON.parse(storedOtherUser) : null;
}
export const authData = writable<AuthData>(userAuth);
export const userStore = writable<UserData>(user);
export const otherUserStore = writable<any | null>(otheruser);
if (browser) {
  authData.subscribe((value) => localStorage.setItem("auth", JSON.stringify(value)));
  userStore.subscribe((value) => localStorage.setItem("user", JSON.stringify(value)));
  otherUserStore.subscribe((value) => localStorage.setItem("otheruser", JSON.stringify(value)));
}

export const phoneConfirmationStore = writable<PhoneVerificationData | null>(null);
export const toast = writable<ToastData | null>(null);

export const addToast = (type: string, message: string) => {
  toast.set({ type, message });
  setTimeout(dismissToast, 5000);
};
export const dismissToast = () => toast.set(null);

export const phoneSignup = async (phoneNumber: string) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    phoneConfirmationStore.set({ confirmation: confirmationResult, phoneNumber: phoneNumber });
  } catch (error) {
    recaptchaVerifier.clear();
    console.error(error);
  }
}

export const resendCodeSignUp = async (phoneNumber: string) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, "verify-recaptcha-container", {});
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    phoneConfirmationStore.set({ confirmation: confirmationResult, phoneNumber: phoneNumber });
  } catch (error) {
    recaptchaVerifier.clear();
    console.error(error);
  }
}

export const phoneVerify = async (code: string) => {
  const confirmationResult = get(phoneConfirmationStore);
  if(!confirmationResult) return;
  if (!confirmationResult.confirmation) return;
  return confirmationResult.confirmation.confirm(code);
}

export const googleSignup = async () => {
  return await signInWithPopup(auth, new GoogleAuthProvider());
}

export const appleSignup = async () => {
  return await signInWithPopup(auth, new OAuthProvider("apple.com"));
}

export const logout = async () => {
  return await signOut(auth);
}
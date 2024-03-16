import { get, writable } from "svelte/store";
import { auth } from "$lib/firebase/client";
import {
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signOut, 
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import type { AuthData, PhoneVerificationData, ToastData } from "../../types";
import { browser } from "$app/environment";

// authentication state stores
let isLoggedIn;
if (browser) {
  isLoggedIn = sessionStorage.getItem("loggedin");
}
export const authData = writable<AuthData>({ user: null, isLoggedIn: isLoggedIn && isLoggedIn === "true" ? true : false });
export const cloudError = writable<string | null>(null);
export const phoneConfirmationStore = writable<PhoneVerificationData | null>(null);
export const toast = writable<ToastData | null>(null);

export const addToast = (type: string, message: string) => {
  toast.update((curr) => { 
    return {
      ...curr,
      type,
      message
    }
  });
  setTimeout(() => {
    dismissToast();
  }, 5000);
};

export const dismissToast = () => {
  toast.update(() => { return null });
};

export async function phoneSignup(phoneNumber: string) {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, new RecaptchaVerifier(auth, "recaptcha-container", {}));
  console.log(confirmationResult);
  phoneConfirmationStore.set({ confirmation: confirmationResult, phoneNumber: phoneNumber });
}

export async function resendCodeSignUp(phoneNumber: string) {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, new RecaptchaVerifier(auth, "verify-recaptcha-container", {}));
  console.log(confirmationResult);
  phoneConfirmationStore.set({ confirmation: confirmationResult, phoneNumber: phoneNumber });
}

export async function phoneVerify(code: string) {
  const confirmationResult = get(phoneConfirmationStore);
  if (!confirmationResult?.confirmation) return;
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

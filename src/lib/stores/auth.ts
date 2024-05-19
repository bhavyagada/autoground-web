import { get, writable } from "svelte/store";
import { browser } from "$app/environment";
import { auth } from "$lib/firebase/client";
import { RecaptchaVerifier, signInWithPhoneNumber, signOut, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { AuthenticationType, type PhoneVerificationData, type ToastData } from "$lib/types";

export const default_user = {
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

export const auth_store = writable(browser && JSON.parse(localStorage.getItem("auth")!) || { user: null, isLoggedIn: false });
export const user_store = writable(browser && JSON.parse(localStorage.getItem("user")!) || default_user);
export const other_user_store = writable(browser && JSON.parse(localStorage.getItem("otheruser")!) || null);
if (browser) {
  auth_store.subscribe((value) => (localStorage.auth = JSON.stringify(value)));
  user_store.subscribe((value) => (localStorage.user = JSON.stringify(value)));
  other_user_store.subscribe((value) => (localStorage.otheruser = JSON.stringify(value)));
}

export const toast = writable<ToastData | null>(null);
export const add_toast = (type: string, message: string) => {
  toast.set({ type, message });
  setTimeout(dismiss_toast, 5000);
};
export const dismiss_toast = () => toast.set(null);

export const phone_confirmation_store = writable<PhoneVerificationData | null>(null);
const handle_phone_recaptcha = async (phone_number: string, container_id: string) => {
  const recaptcha_verifier = new RecaptchaVerifier(auth, container_id, {});
  try {
    const confirmation_result = await signInWithPhoneNumber(auth, phone_number, recaptcha_verifier);
    phone_confirmation_store.set({ confirmation: confirmation_result, phoneNumber: phone_number });
  } catch (error) {
    recaptcha_verifier.clear();
  }
}
export const phone_sign_up = async (phone_number: string) => await handle_phone_recaptcha(phone_number, "recaptcha-container");
export const resend_code_sign_up = async (phone_number: string) => await handle_phone_recaptcha(phone_number, "verify-recaptcha-container");
export const phone_verify = async (code: string) => {
  const confirmation_result = get(phone_confirmation_store);
  if (confirmation_result?.confirmation) return confirmation_result.confirmation.confirm(code);
}
export const google_sign_up = async () => await signInWithPopup(auth, new GoogleAuthProvider());
export const apple_sign_up = async () => await signInWithPopup(auth, new OAuthProvider("apple.com"));
export const logout = async () => await signOut(auth);
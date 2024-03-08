import { 
  get, 
  writable 
} from "svelte/store";
import { auth } from "$lib/client/firebase.client";
import {
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signOut, 
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  type ConfirmationResult,
  type UserCredential,
  type User,
} from "firebase/auth";
import { browser } from "$app/environment";
import { 
  defaultUser, 
  userStore 
} from "./userStore";
import { goto } from "$app/navigation";

let localAuthData;
if (browser) {
  localAuthData = window.sessionStorage.getItem("auth")
}
export const authStore = writable<User | null>(localAuthData ? JSON.parse(localAuthData) : null);

export const confirmationResultStore = writable<ConfirmationResult | null>();

// triggers when user enters phone number and continues
// requires solving recaptcha to prevent abuse
export async function phoneSignup(phoneNumber: string) {
  console.log("In Phone Sign Up");
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

  console.log(recaptchaVerifier);
  if (!recaptchaVerifier) return;
  
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  console.log(confirmationResult);
  confirmationResultStore.set(confirmationResult);
}

// triggers when user submits phone verification code
export async function phoneVerify(code: string) {
  const confirmationResult = get(confirmationResultStore);
  if (!confirmationResult) return;

  try {
    await confirmationResult.confirm(code);
    const userCredential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);
    const credential = await signInWithCredential(auth, userCredential);
    return credential.user;
  } catch (error) {
    console.error(error);
  }
}

// triggers when user chooses google signup
// it will open a popup window
export async function googleSignup() {
  try {
    const result: UserCredential = await signInWithPopup(auth, new GoogleAuthProvider());
    return result.user;
  } catch (error) {
    console.error(error);
  }
}

// triggers when user chooses apple signup
// it will open a popup window
export async function appleSignup() {
  try {
    const result: UserCredential = await signInWithPopup(auth, new OAuthProvider("apple.com"));
    return result.user;
  } catch (error) {
    console.error(error);
  }
}

// triggers when user wants to logout
// works for any authentication method (phone, google, or apple)
export async function logout() {
  try {
    await signOut(auth);
    authStore.set(null);
    userStore.set(defaultUser);
    window.sessionStorage.setItem("auth", JSON.stringify(null));
    window.sessionStorage.setItem("user", JSON.stringify(defaultUser));
    goto("/login");
  } catch (error) {
    console.error(error);
  }
}

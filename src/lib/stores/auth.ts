import { get, writable } from "svelte/store";
import { auth } from "$lib/firebase/client";
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
  type User,
} from "firebase/auth";

export const user = writable<User | null>(null);

export const confirmationResultStore = writable<ConfirmationResult | null>();

export async function phoneSignup(phoneNumber: string) {
  console.log("In Phone Sign Up");
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

  console.log(recaptchaVerifier);
  if (!recaptchaVerifier) return;
  
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  console.log(confirmationResult);
  confirmationResultStore.set(confirmationResult);
}

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

export async function googleSignup() {
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function appleSignup() {
  await signInWithPopup(auth, new OAuthProvider("apple.com"));
}

export async function logout() {
  return await signOut(auth);
}

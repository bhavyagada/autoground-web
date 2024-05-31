import cookie from "cookie";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFunctions, type Functions } from "firebase/functions";
import { browser } from "$app/environment";
import { auth_store } from "$lib/stores/auth";

// initialize firebase client app
const makeApp = (): FirebaseApp => {
  const apps: FirebaseApp[] = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return initializeApp({
    apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID
  });
}

// export firebase service instances
export const app: FirebaseApp = makeApp();
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// cookie handling
if (browser) {
  // add an observer to create or update the 'token' cookie when the user's ID token changes
	// this is triggered on sign-in, sign-out, and token refresh events
  auth.onIdTokenChanged(async (newUser) => {
    const token = await newUser?.getIdToken();

    // create a cookie for the token or delete it if token is undefined
    document.cookie = cookie.serialize("token", token ?? "", {
      path: "/",
      maxAge: token ? undefined : 0,
      sameSite: "none",
      secure: true
    });

    auth_store.update((curr) => { 
      return { ...curr, user: newUser };
    });
  });

  // refresh the ID token every 10 minutes
  setInterval(async () => {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
  }, 10 * 60 * 1000);
}
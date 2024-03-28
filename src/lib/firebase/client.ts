import cookie from "cookie";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFunctions, type Functions } from "firebase/functions";
import {
  PUBLIC_FIREBASE_APIKEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_MEASUREMENT_ID
} from "$env/static/public";
import { browser } from "$app/environment";
import { authData } from "$lib/stores/auth";

// initialize firebase client app
const makeApp = (): FirebaseApp => {
  const apps: FirebaseApp[] = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return initializeApp({
    apiKey: PUBLIC_FIREBASE_APIKEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
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

    authData.update((curr) => { 
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
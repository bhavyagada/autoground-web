import cookie from "cookie";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
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
} from "$env/static/public"
import { browser } from "$app/environment";
import { user } from "$lib/stores/auth";

function makeApp() {
  const apps: FirebaseApp[] = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  // Firebase configuration
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

// export firebase instances
export const app: FirebaseApp = makeApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Only run in the browser, otherwise this will run during SSR and will break
if (browser) {
  // Add an observer to create or update the 'token' cookie when the user's ID token changes
	// This is triggered on sign-in, sign-out, and token refresh events
  auth.onIdTokenChanged(async (newUser) => {
    const token = await newUser?.getIdToken();

    // Create a cookie for the token or delete it if token is undefined
    document.cookie = cookie.serialize("token", token ?? "", {
      path: "/",
      maxAge: token ? undefined : 0,
    });

    user.set(newUser);
  });

  // refresh the ID token every 10 minutes
  setInterval(async () => {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
  }, 10 * 60 * 1000);
}


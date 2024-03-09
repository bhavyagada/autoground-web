import admin from "firebase-admin";
import { getApps, initializeApp, type App } from "firebase-admin/app"
import { 
  FIREBASE_ADMIN_PRIVATE_KEY, 
  FIREBASE_ADMIN_CLIENT_EMAIL 
} from "$env/static/private"
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { getAuth, type Auth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

function makeApp() {
  const apps: App[] = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return initializeApp({
    credential: admin.credential.cert({
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: PUBLIC_FIREBASE_PROJECT_ID
    })
  });
}

export const app: App = makeApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

import admin from "firebase-admin";
import { getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { FB_ADMIN_PRIVATE_KEY, FB_ADMIN_CLIENT_EMAIL } from "$env/static/private";
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";

// initialize firebase admin app
const makeApp = (): App => {
  const apps: App[] = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return initializeApp({
    credential: admin.credential.cert({
      privateKey: FB_ADMIN_PRIVATE_KEY,
      clientEmail: FB_ADMIN_CLIENT_EMAIL,
      projectId: PUBLIC_FIREBASE_PROJECT_ID
    })
  });
}

export const app: App = makeApp();
export const auth: Auth = getAuth(app);
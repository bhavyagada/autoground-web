import admin from "firebase-admin";
import { getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

// initialize firebase admin app
const makeApp = (): App => {
  const apps: App[] = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return initializeApp({
    credential: admin.credential.cert({
      privateKey: import.meta.env.FB_ADMIN_PRIVATE_KEY,
      clientEmail: import.meta.env.FB_ADMIN_CLIENT_EMAIL,
      projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID
    })
  });
}

export const app: App = makeApp();
export const auth: Auth = getAuth(app);
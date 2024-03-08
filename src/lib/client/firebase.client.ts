import { 
  getApps, 
  initializeApp, 
  type FirebaseApp, 
} from "firebase/app";
import { 
  getAuth,
  type Auth, 
} from "firebase/auth";
import { 
  getFirestore, 
  type Firestore 
} from "firebase/firestore";
import { 
  getStorage, 
  type FirebaseStorage 
} from "firebase/storage";
import { 
  getFunctions, 
  type Functions 
} from "firebase/functions";
// import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig: Object = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
export let app: FirebaseApp;
export let auth: Auth;
export let db: Firestore;
export let storage: FirebaseStorage;
export let functions: Functions;
// export const analytics = getAnalytics(app);

if (!getApps.length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
}

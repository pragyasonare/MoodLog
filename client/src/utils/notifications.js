
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase"; // make sure this exports an initialized `messaging` object

export const getFCMToken = async () => {
  try {
    // ✅ Register service worker manually
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // ✅ Pass that registration into getToken
    const token = await getToken(messaging, {
      vapidKey:  import.meta.env.VITE_FIREBASE_VAPID_KEY ,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.warn("⚠️ No token available. Permission may be denied.");
      return null;
    }
  } catch (err) {
    console.error("🔥 FCM Token Error:", err);
    return null;
  }
};


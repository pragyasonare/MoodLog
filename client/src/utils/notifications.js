
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase"; // make sure this exports an initialized `messaging` object

export const getFCMToken = async () => {
  try {
    // ✅ Register service worker manually
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // ✅ Pass that registration into getToken
    const token = await getToken(messaging, {
      vapidKey:  "BOqv3Z38e7H6Bcbqs6lFE1rATLpgVY9u1XK4OLvGpofz1Y2VoOlhulgvRbCq-9wN1TpAkC3Z3tQgb-vZdwmI_Ms" ,
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


import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAOQQjZlA4oOxG8XAz1QePeENWde3Emk20",
  authDomain: "moodlog-2cc45.firebaseapp.com",
  projectId: "moodlog-2cc45",
  storageBucket: "moodlog-2cc45.firebasestorage.app",
  messagingSenderId: "670821874516",
  appId: "1:670821874516:web:c30d2c42bca37a7bf726c1",
  measurementId: "G-J55R4YT70L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
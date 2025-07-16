
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAOQQjZlA4oOxG8XAz1QePeENWde3Emk20",
  projectId: "moodlog-2cc45",
  messagingSenderId: "670821874516",
  appId: "1:670821874516:web:c30d2c42bca37a7bf726c1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const { title, body, icon } = payload?.notification || {};

  const notificationTitle = title || "MoodLog💭 Reminder";
  const notificationOptions = {
    body: body || "It's time to log your mood!",
    icon: icon || '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});



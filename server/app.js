// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const cron = require("node-cron");
// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account.json");

// const userRoutes = require("./routes/userRoutes");
// const moodRoutes = require("./routes/moodRoutes");

// const Reminder = require("./models/reminderModel");
// const User = require("./models/User");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: process.env.FIREBASE_PROJECT_ID,
// });

// const app = express();

// // ==== ENVIRONMENT VARIABLE CHECK ====
// if (
//   !process.env.MONGO_URI ||
//   !process.env.JWT_SECRET ||
//   !process.env.FIREBASE_PROJECT_ID
// ) {
//   console.error("❌ Missing critical environment variables");
//   process.exit(1);
// }

// // ==== CONNECT TO MONGODB ====
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.error("❌ MongoDB Connection Error:", err.message);
//     process.exit(1);
//   }
// };

// // ==== TEST JWT ====
// const testJWT = () => {
//   try {
//     const token = jwt.sign({ test: true }, process.env.JWT_SECRET, {
//       expiresIn: "1s",
//     });
//     jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ JWT Configuration Valid");
//   } catch (err) {
//     console.error("❌ JWT Error:", err.message);
//     process.exit(1);
//   }
// };

// app.use(cors());
// app.use(express.json());

// // ==== HEALTH CHECK ====
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     status: "healthy",
//     dbState:
//       mongoose.connection.readyState === 1 ? "connected" : "disconnected",
//     firebase: admin.apps.length > 0 ? "connected" : "disconnected",
//   });
// });

// // ==== ROUTES ====
// app.use("/api/users", userRoutes);
// app.use("/api/moods", moodRoutes);

// // deppseek
// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
//   console.log(`\n⏰ Checking reminders at ${currentTime}...`);

//   // Helper: Convert "HH:MM" to minutes since midnight
//   const getMinutesSinceMidnight = (timeStr) => {
//     const [h, m] = timeStr.split(":").map(Number);
//     return h * 60 + m;
//   };

//   try {
//     const reminders = await Reminder.find({ enabled: true }).populate("userId");

//     const results = await Promise.allSettled(
//       reminders.map(async (reminder) => {
//         // Skip if user is invalid
//         if (!reminder.userId) {
//           console.warn(`⚠️ Reminder ${reminder._id} has no user`);
//           return { ignored: true };
//         }

//         const reminderTime = reminder.time;
//         const reminderDate = new Date(now);
//         reminderDate.setHours(
//           parseInt(reminderTime.split(":")[0]),
//           parseInt(reminderTime.split(":")[1]),
//           0,
//           0
//         );

//         const timeDiffInSeconds = (now - reminderDate) / 1000;
//         const currentMins = getMinutesSinceMidnight(currentTime);
//         const reminderMins = getMinutesSinceMidnight(reminder.time);

//         // Case 1: Time passed (reschedule for next day)
//         if (timeDiffInSeconds > 60) {
//           const nextDayTime = new Date(reminderDate);
//           nextDayTime.setDate(reminderDate.getDate() + 1);
//           const formattedTime = nextDayTime.toTimeString().slice(0, 5);

//           await Reminder.findByIdAndUpdate(reminder._id, {
//             time: formattedTime,
//           });

//           console.log(
//             `📅 Reminder for user ${reminder.userId._id} rescheduled for tomorrow at ${formattedTime}`
//           );
//           return { skipped: true, userId: reminder.userId._id };
//         }

//         // Case 2: Time matches (send notification)
//         if (Math.abs(currentMins - reminderMins) <= 1) {
//           // 1-minute window
//           const token = reminder.userId.pushToken?.trim();
//           if (!token) {
//             console.warn(`⚠️ No push token for user ${reminder.userId._id}`);
//             return {
//               success: false,
//               reason: "No push token",
//               userId: reminder.userId._id,
//             };
//           }

//           try {
//             const response = await admin.messaging().send({
//               token: token,
//               webpush: {
//                 notification: {
//                   title: "MoodLog💭 Reminder",
//                   body: "How is your day going? 😊 Time to log your mood..",
//                   // image: "https://your-deployed-site.com/icon.png", // Use actual deployed icon URL
//                   // click_action: "https://your-deployed-site.com/", // optional
//                 },
//               },
//               data: { click_action: "OPEN_APP" },
//             });

//             console.log(
//               `✅ Firebase send success for user ${reminder.userId._id}: ${response}`
//             );
//             return { success: true, userId: reminder.userId._id };
//           } catch (err) {
//             console.error(
//               `❌ Firebase send failed for user ${reminder.userId._id}:`,
//               err.message
//             );

//             if (err.code === "messaging/invalid-registration-token") {
//               await User.findByIdAndUpdate(reminder.userId._id, {
//                 $unset: { pushToken: 1 },
//               });
//               console.warn(
//                 `🚫 Removed invalid pushToken from user ${reminder.userId._id}`
//               );
//             }
//             return { success: false, error: err.message };
//           }
//         }

//         return { ignored: true };
//       })
//     );

//     // Log results (unchanged from your original)
//     results.forEach((result) => {
//       if (result.value?.success) {
//         console.log(`📲 Notification sent to ${result.value.userId}`);
//       } else if (result.value?.skipped) {
//         console.log(
//           `⏭️ Reminder for user ${result.value.userId} skipped (time passed)`
//         );
//       } else if (result.value?.error) {
//         console.log(`⚠️ Failed: ${result.value.error}`);
//       }
//     });
//   } catch (err) {
//     console.error("❌ Cron error:", err.message);
//   }
// });

// // ==== START SERVER ====
// const startServer = async () => {
//   await connectDB();
//   testJWT();

//   app.listen(process.env.PORT, () => {
//     console.log(`🚀 Server running on port ${process.env.PORT}`);
//     console.log(
//       `🔗 Health Check: http://localhost:${process.env.PORT}/api/health`
//     );
//     console.log(`🔥 Firebase Project: ${admin.app().options.projectId}`);
//   });
// };

// startServer();












require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const admin = require("firebase-admin");


const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};


const userRoutes = require("./routes/userRoutes");
const moodRoutes = require("./routes/moodRoutes");

const Reminder = require("./models/reminderModel");
const User = require("./models/User");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const app = express();

// ==== ENVIRONMENT VARIABLE CHECK ====
if (
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  !process.env.FIREBASE_PROJECT_ID
) {
  console.error("❌ Missing critical environment variables");
  process.exit(1);
}

// ==== CONNECT TO MONGODB ====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// ==== TEST JWT ====
const testJWT = () => {
  try {
    const token = jwt.sign({ test: true }, process.env.JWT_SECRET, {
      expiresIn: "1s",
    });
    jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ JWT Configuration Valid");
  } catch (err) {
    console.error("❌ JWT Error:", err.message);
    process.exit(1);
  }
};

app.use(cors({
  origin: [
    'https://moodlog-frontend.onrender.com', // Production frontend
    'http://localhost:3000'                  // Local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ==== HEALTH CHECK ====
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    dbState:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    firebase: admin.apps.length > 0 ? "connected" : "disconnected",
  });
});

// ==== ROUTES ====
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);

// deppseek
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  console.log(`\n⏰ Checking reminders at ${currentTime}...`);

  // Helper: Convert "HH:MM" to minutes since midnight
  const getMinutesSinceMidnight = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  try {
    const reminders = await Reminder.find({ enabled: true }).populate("userId");

    const results = await Promise.allSettled(
      reminders.map(async (reminder) => {
        // Skip if user is invalid
        if (!reminder.userId) {
          console.warn(`⚠️ Reminder ${reminder._id} has no user`);
          return { ignored: true };
        }

        const reminderTime = reminder.time;
        const reminderDate = new Date(now);
        reminderDate.setHours(
          parseInt(reminderTime.split(":")[0]),
          parseInt(reminderTime.split(":")[1]),
          0,
          0
        );

        const timeDiffInSeconds = (now - reminderDate) / 1000;
        const currentMins = getMinutesSinceMidnight(currentTime);
        const reminderMins = getMinutesSinceMidnight(reminder.time);

        // Case 1: Time passed (reschedule for next day)
        if (timeDiffInSeconds > 60) {
          const nextDayTime = new Date(reminderDate);
          nextDayTime.setDate(reminderDate.getDate() + 1);
          const formattedTime = nextDayTime.toTimeString().slice(0, 5);

          await Reminder.findByIdAndUpdate(reminder._id, {
            time: formattedTime,
          });

          console.log(
            `📅 Reminder for user ${reminder.userId._id} rescheduled for tomorrow at ${formattedTime}`
          );
          return { skipped: true, userId: reminder.userId._id };
        }

        // Case 2: Time matches (send notification)
        if (Math.abs(currentMins - reminderMins) <= 1) {
          // 1-minute window
          const token = reminder.userId.pushToken?.trim();
          if (!token) {
            console.warn(`⚠️ No push token for user ${reminder.userId._id}`);
            return {
              success: false,
              reason: "No push token",
              userId: reminder.userId._id,
            };
          }

          try {
            const response = await admin.messaging().send({
              token: token,
              webpush: {
                notification: {
                  title: "MoodLog💭 Reminder",
                  body: "How is your day going? 😊 Time to log your mood..",
                  // image: "https://your-deployed-site.com/icon.png", // Use actual deployed icon URL
                  // click_action: "https://your-deployed-site.com/", // optional
                },
              },
              data: { click_action: "OPEN_APP" },
            });

            console.log(
              `✅ Firebase send success for user ${reminder.userId._id}: ${response}`
            );
            return { success: true, userId: reminder.userId._id };
          } catch (err) {
            console.error(
              `❌ Firebase send failed for user ${reminder.userId._id}:`,
              err.message
            );

            if (err.code === "messaging/invalid-registration-token") {
              await User.findByIdAndUpdate(reminder.userId._id, {
                $unset: { pushToken: 1 },
              });
              console.warn(
                `🚫 Removed invalid pushToken from user ${reminder.userId._id}`
              );
            }
            return { success: false, error: err.message };
          }
        }

        return { ignored: true };
      })
    );

    // Log results (unchanged from your original)
    results.forEach((result) => {
      if (result.value?.success) {
        console.log(`📲 Notification sent to ${result.value.userId}`);
      } else if (result.value?.skipped) {
        console.log(
          `⏭️ Reminder for user ${result.value.userId} skipped (time passed)`
        );
      } else if (result.value?.error) {
        console.log(`⚠️ Failed: ${result.value.error}`);
      }
    });
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});

// ==== START SERVER ====
const startServer = async () => {
  await connectDB();
  testJWT();

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
    console.log(
      `🔗 Health Check: http://localhost:${process.env.PORT}/api/health`
    );
    console.log(`🔥 Firebase Project: ${admin.app().options.projectId}`);
  });
};

startServer();

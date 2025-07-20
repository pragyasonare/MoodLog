import axios from "axios";
import { getFCMToken } from "../utils/notifications";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  FiHome,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiClock,
  FiBell,
  FiBellOff,
  FiSettings,
} from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { logout } = useAuth();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTime, setReminderTime] = useState("12:00"); // Default time
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");

  const { token, reminder, setUserReminder, deleteReminder } = useAuth();

  useEffect(() => {
    const savedTime = localStorage.getItem("moodifyReminder");
    if (savedTime) {
      setReminderTime(savedTime);
      setIsReminderActive(true);
    }

    // Initialize notification permission state
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleSaveReminder = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const fcmToken = await getFCMToken();
        const authToken = localStorage.getItem("token"); // Your JWT from login

        if (!authToken) {
          throw new Error("No auth token found. Please log in.");
        }





        await axios.post(
          "https://moodlog.onrender.com/api/users/save-push-token",
          { token: fcmToken },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

//         await axios.post(
//   "https://moodlog.onrender.com/api/users/save-push-token",
//   { pushToken: fcmToken }, // ✅ this must match backend expectation
//   {
//     headers: { Authorization: `Bearer ${authToken}` },
//   }
// );


        setPermissionStatus(permission);
      } else {
        setPermissionStatus(permission);
        throw new Error("Notifications blocked");
      }

      // Save reminder time logic
      if (reminderTime) {
        await setUserReminder(reminderTime);
      } else {
        localStorage.setItem("moodifyReminder", reminderTime);
      }

      setIsReminderActive(true);
      setShowReminderModal(false);
    } catch (error) {
      console.error("Error setting reminder:", error);
      if (error.message === "Notifications blocked") {
        alert("Please enable notifications for reminders to work");
      }
      if (error.message.includes("auth")) {
        alert("You must be logged in to save push tokens.");
      }
    }
  };

  const handleDisableReminder = async () => {
    if (token) {
      await deleteReminder();
    }
    localStorage.removeItem("moodifyReminder");
    setIsReminderActive(false);
    setShowReminderModal(false);
  };

  useEffect(() => {
    const savedTime = token
      ? reminder
      : localStorage.getItem("moodifyReminder");
    if (savedTime) {
      setReminderTime(savedTime);
      setIsReminderActive(true);
    }
  }, [token, reminder]);

  const showPermissionGuide = () => {
    const guide = `
      To enable notifications:
      1. Click the lock icon (🔒) in your address bar
      2. Select "Site settings"
      3. Change "Notifications" to "Allow"
    `;
    alert(guide);
  };

  return (
    <nav className="w-full px-15 py-4 fixed top-0 left-0 z-50 bg-gradient-to-b from-purple-900/90 to-transparent text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/dashboard"
          className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent pb-1 leading -tight"
        >
          MoodLog 💭
        </Link>

        <div className="flex items-center gap-4">
          <NavLink to="/dashboard" icon={<FiHome size={18} />} label="Home" />
          <NavLink
            to="/history"
            icon={<FiCalendar size={18} />}
            label="History"
          />
          <NavLink
            to="/reports"
            icon={<FiBarChart2 size={18} />}
            label="Reports"
          />

          {/* Reminder Button */}
          <button
            onClick={() => setShowReminderModal(true)}
            className="flex items-center gap-1 px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {isReminderActive ? <FiBell size={18} /> : <FiClock size={18} />}
            <span>
              {isReminderActive && reminderTime && reminderTime !== "null"
                ? `Reminder: ${reminderTime}`
                : "Set Reminder"}
            </span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 flex items-center gap-1"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-pink-800 p-6 rounded-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Daily Mood Check</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Reminder Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-2 bg-white/10 rounded mb-4"
                  required
                />
              </div>

              {permissionStatus === "denied" && (
                <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30 text-sm">
                  <p className="flex items-center gap-2">
                    <FiSettings /> Notifications are blocked
                  </p>
                  <button
                    onClick={showPermissionGuide}
                    className="mt-2 text-purple-300 hover:underline text-xs"
                  >
                    How to enable
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSaveReminder}
                  className="flex-1 py-2 bg-pink-500 rounded hover:bg-pink-600 transition"
                >
                  {isReminderActive ? "Update" : "Enable"}
                </button>

                {isReminderActive && (
                  <button
                    onClick={handleDisableReminder}
                    className="flex-1 py-2 bg-red-500/20 rounded hover:bg-red-500/30 transition"
                  >
                    <FiBellOff className="inline mr-1" />
                    Disable
                  </button>
                )}

                <button
                  onClick={() => setShowReminderModal(false)}
                  className="flex-1 py-2 bg-white/10 rounded hover:bg-white/20 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

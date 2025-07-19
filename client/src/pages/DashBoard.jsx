
// import { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "../components/Navbar";

// const moods = {
//   happy: {
//     emoji: "😊",
//     color: "bg-yellow-300",
//     hoverColor: "hover:bg-yellow-800",
//     theme: "from-yellow-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DXdPec7aLTmlC",
//     description: "Joyful, grateful, or playful",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
//   sad: {
//     emoji: "😢",
//     color: "bg-blue-300",
//     hoverColor: "hover:bg-blue-400",
//     theme: "from-blue-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DX7qK8ma5wgG1",
//     description: "Heartbroken, lonely, or melancholic",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
//   energetic: {
//     emoji: "⚡",
//     color: "bg-orange-300",
//     hoverColor: "hover:bg-purple-900",
//     theme: "from-orange-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DX4dyzvuaRJ0n",
//     description: "Pumped, hyper, or restless",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
//   calm: {
//     emoji: "🍃",
//     color: "bg-emerald-600",
//     hoverColor: "hover:bg-emerald-400",
//     theme: "from-emerald-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DX4UmBeyb3K8R",
//     description: "Peaceful, zen, or relaxed",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
//   angry: {
//     emoji: "😤",
//     color: "bg-red-400",
//     hoverColor: "hover:bg-red-700",
//     theme: "from-red-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DX3YSRoSdA634",
//     description: "Irritated, overwhelmed, or resentful",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
//   anxious: {
//     emoji: "😰",
//     color: "bg-indigo-600",
//     hoverColor: "hover:bg-indigo-400",
//     theme: "from-indigo-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DX8hUq3jyvfJh",
//     description: "Nervous, panicky, or burnt out",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
//   fire: {
//     emoji: "🔥",
//     color: "bg-amber-300",
//     hoverColor: "hover:bg-pink-900",
//     theme: "from-amber-900 via-black to-gray-900",
//     playlistId: "37i9dQZF1DX6aTaZa0K6VA",
//     description: "Inspired, motivated, or enthusiastic",
//     actions: ["Journal It", "Play Music", "Get Advice"],
//   },
// };

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [showActions, setShowActions] = useState(false);
//   const [journalText, setJournalText] = useState("");
//   const [recentJournals, setRecentJournals] = useState([]);

//   // Fetch recent journals on load
//   useEffect(() => {
//     const fetchRecentJournals = async () => {
//       try {
//         const res = await axios.get("/api/moods/history?limit=3", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setRecentJournals(res.data.filter((m) => m.note));
//       } catch (err) {
//         console.error("Failed to fetch journals:", err);
//       }
//     };
//     fetchRecentJournals();
//   }, []);

//   const handleMoodSelect = async (mood) => {
//     try {
//       await axios.post("/api/moods", { moodType: mood });
//       setSelectedMood(mood);
//     } catch (err) {
//       alert("Failed to save mood. Please login again.");
//     }
//   };

//   const handleAction = (action) => {
//     switch (action) {
//       case "Journal It":
//         setShowActions("journal");
//         break;
//       case "Play Music":
//         window.open(
//           `https://open.spotify.com/playlist/${moods[selectedMood].playlistId}`
//         );
//         break;
//       case "Get Advice":
//         setShowActions("advice");
//         break;
//       default:
//         setShowActions(false);
//     }
//   };

//   const saveJournal = async () => {
//     try {
//       const newJournal = {
//         mood: selectedMood,
//         text: journalText,
//         date: new Date().toISOString(),
//       };

//       await axios.patch(`/api/moods/latest`, { note: journalText });

//       setRecentJournals([newJournal, ...recentJournals.slice(0, 2)]);
//       setJournalText("");
//       setShowActions(false);
//     } catch (err) {
//       console.error("Failed to save journal:", err);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       {/* Full screen color background */}
//       <div
//         className={`fixed inset-0 transition-colors duration-500 z-0 ${
//           selectedMood
//             ? `bg-gradient-to-br ${
//                 moods[selectedMood]?.theme ||
//                 "from-purple-900 via-black to-gray-900"
//               }`
//             : "bg-gradient-to-br from-purple-900 via-black to-gray-900"
//         }`}
//       ></div>

//       {/* Content container */}
//       <div className="relative z-10 min-h-screen text-white p-4 md:p-20">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-red-400"></h1>
//           <p className="text-xl font-bold text-gray-400 italic">
//             Welcome, How are you feeling today?✨{" "}
//             <span className="text-white font-semibold"></span>
//           </p>
//         </div>

//         <div className="space-y-8 mb-12">
//           {/* First row: 4 moods */}
//           <div className="grid grid-cols-4 gap-5 md:gap-8">
//             {Object.keys(moods)
//               .slice(0, 4)
//               .map((mood) => (
//                 <motion.button
//                   key={mood}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleMoodSelect(mood)}
//                   className={`rounded-full p-5 md:p-7 shadow-xl text-black font-semibold text-lg transition-all duration-300 
//           ${moods[mood].color} ${moods[mood].hoverColor}`}
//                 >
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-400 flex items-center justify-center relative">
//                       <div className="absolute w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center">
//                         <div className="absolute w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
//                           <span className="text-4xl">{moods[mood].emoji}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <span className="capitalize text-sm md:text-base">
//                       {mood}
//                     </span>
//                   </div>
//                 </motion.button>
//               ))}
//           </div>

//           {/* Second row: 3 moods */}
//           <div className="grid grid-cols-3 gap-5 md:gap-8 justify-center">
//             {Object.keys(moods)
//               .slice(4, 7)
//               .map((mood) => (
//                 <motion.button
//                   key={mood}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleMoodSelect(mood)}
//                   className={`rounded-full p-5 md:p-7 shadow-xl text-black font-semibold text-lg transition-all duration-300 
//           ${moods[mood].color} ${moods[mood].hoverColor}`}
//                 >
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-400 flex items-center justify-center relative">
//                       <div className="absolute w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center">
//                         <div className="absolute w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
//                           <span className="text-4xl">{moods[mood].emoji}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <span className="capitalize text-sm md:text-base">
//                       {mood}
//                     </span>
//                   </div>
//                 </motion.button>
//               ))}
//           </div>
//         </div>

//         {/* Selected Mood Section */}
//         {selectedMood && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mx-auto max-w-xl bg-white/10 border border-white/20 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-lg mb-12"
//           >
//             <h2 className="text-2xl font-bold mb-4 text-pink-400">
//               {moods[selectedMood].emoji}{" "}
//               {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
//             </h2>
//             <p className="mb-6 text-gray-200">
//               {moods[selectedMood].description}
//             </p>

//             <div className="grid grid-cols-3 gap-3 md:gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleAction("Journal It")}
//                 className="bg-blue-500/90 hover:bg-blue-600 p-2 md:p-3 rounded-xl flex flex-col items-center"
//               >
//                 <span className="text-xl md:text-2xl mb-1">📝</span>
//                 <span className="text-xs md:text-sm">Journal</span>
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleAction("Play Music")}
//                 className="bg-green-500/90 hover:bg-green-600 p-2 md:p-3 rounded-xl flex flex-col items-center"
//               >
//                 <span className="text-xl md:text-2xl mb-1">🎵</span>
//                 <span className="text-xs md:text-sm">Play Music</span>
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleAction("Get Advice")}
//                 className="bg-purple-500/90 hover:bg-purple-600 p-2 md:p-3 rounded-xl flex flex-col items-center"
//               >
//                 <span className="text-xl md:text-2xl mb-1">💡</span>
//                 <span className="text-xs md:text-sm">Get Advice</span>
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//         {/* Enhanced Journal Modal */}
//         <AnimatePresence>
//           {showActions === "journal" && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             >
//               <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 className="bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500/30 rounded-2xl p-8 w-full max-w-6xl shadow-xl"
//               >
//                 <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
//                   Journal Your Feelings
//                 </h3>
//                 <textarea
//                   value={journalText}
//                   onChange={(e) => setJournalText(e.target.value)}
//                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-white mb-6 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
//                   placeholder="How are you feeling today?"
//                   rows={8}
//                   autoFocus
//                 />
//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={() => setShowActions(false)}
//                     className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={saveJournal}
//                     disabled={!journalText.trim()}
//                     className={`px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition text-lg ${
//                       !journalText.trim() ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     Save Journal
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//         {/* Advice Modal */}
//         <AnimatePresence>
//           {showActions === "advice" && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             >
//               <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl"
//               >
//                 <h3 className="text-xl font-bold mb-4 text-pink-400">
//                   Advice for {selectedMood} Days
//                 </h3>
//                 <div className="space-y-3">
//                   {[
//                     "Take 3 deep breaths",
//                     "Write down 3 things you're grateful for",
//                     "Call a friend who makes you laugh",
//                     "Go for a 10-minute walk",
//                     "Listen to your favorite song",
//                   ].map((advice, i) => (
//                     <div
//                       key={i}
//                       className="bg-white/5 p-3 rounded-lg border border-white/10"
//                     >
//                       <p className="text-gray-200">{advice}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => setShowActions(false)}
//                   className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
//                 >
//                   Close
//                 </button>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }


















import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

// ✅ Set base URL globally
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://moodlog.onrender.com";

// Mood configuration
const moods = {
  happy: {
    emoji: "😊",
    color: "bg-yellow-300",
    hoverColor: "hover:bg-yellow-800",
    theme: "from-yellow-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DXdPec7aLTmlC",
    description: "Joyful, grateful, or playful",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
  sad: {
    emoji: "😢",
    color: "bg-blue-300",
    hoverColor: "hover:bg-blue-400",
    theme: "from-blue-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DX7qK8ma5wgG1",
    description: "Heartbroken, lonely, or melancholic",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
  energetic: {
    emoji: "⚡",
    color: "bg-orange-300",
    hoverColor: "hover:bg-purple-900",
    theme: "from-orange-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DX4dyzvuaRJ0n",
    description: "Pumped, hyper, or restless",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
  calm: {
    emoji: "🍃",
    color: "bg-emerald-600",
    hoverColor: "hover:bg-emerald-400",
    theme: "from-emerald-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DX4UmBeyb3K8R",
    description: "Peaceful, zen, or relaxed",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
  angry: {
    emoji: "😤",
    color: "bg-red-400",
    hoverColor: "hover:bg-red-700",
    theme: "from-red-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DX3YSRoSdA634",
    description: "Irritated, overwhelmed, or resentful",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
  anxious: {
    emoji: "😰",
    color: "bg-indigo-600",
    hoverColor: "hover:bg-indigo-400",
    theme: "from-indigo-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DX8hUq3jyvfJh",
    description: "Nervous, panicky, or burnt out",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
  fire: {
    emoji: "🔥",
    color: "bg-amber-300",
    hoverColor: "hover:bg-pink-900",
    theme: "from-amber-900 via-black to-gray-900",
    playlistId: "37i9dQZF1DX6aTaZa0K6VA",
    description: "Inspired, motivated, or enthusiastic",
    actions: ["Journal It", "Play Music", "Get Advice"],
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [recentJournals, setRecentJournals] = useState([]);

  useEffect(() => {
    const fetchRecentJournals = async () => {
      try {
        const res = await axios.get("/api/moods/history?limit=3", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRecentJournals(res.data.filter((m) => m.note));
      } catch (err) {
        console.error("Failed to fetch journals:", err);
      }
    };
    fetchRecentJournals();
  }, []);

  const handleMoodSelect = async (mood) => {
    try {
      await axios.post("/api/moods", { moodType: mood });
      setSelectedMood(mood);
    } catch (err) {
      alert("Failed to save mood. Please login again.");
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case "Journal It":
        setShowActions("journal");
        break;
      case "Play Music":
        window.open(
          `https://open.spotify.com/playlist/${moods[selectedMood].playlistId}`
        );
        break;
      case "Get Advice":
        setShowActions("advice");
        break;
      default:
        setShowActions(false);
    }
  };

  const saveJournal = async () => {
    try {
      const newJournal = {
        mood: selectedMood,
        text: journalText,
        date: new Date().toISOString(),
      };

      await axios.patch(`/api/moods/latest`, { note: journalText });

      setRecentJournals([newJournal, ...recentJournals.slice(0, 2)]);
      setJournalText("");
      setShowActions(false);
    } catch (err) {
      console.error("Failed to save journal:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className={`fixed inset-0 transition-colors duration-500 z-0 ${
          selectedMood
            ? `bg-gradient-to-br ${moods[selectedMood]?.theme}`
            : "bg-gradient-to-br from-purple-900 via-black to-gray-900"
        }`}
      ></div>

      <div className="relative z-10 min-h-screen text-white p-4 md:p-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-red-400"></h1>
          <p className="text-xl font-bold text-gray-400 italic">
            Welcome, How are you feeling today?✨
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <div className="grid grid-cols-4 gap-5 md:gap-8">
            {Object.keys(moods)
              .slice(0, 4)
              .map((mood) => (
                <motion.button
                  key={mood}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`rounded-full p-5 md:p-7 shadow-xl text-black font-semibold text-lg transition-all duration-300 
          ${moods[mood].color} ${moods[mood].hoverColor}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-400 flex items-center justify-center relative">
                      <div className="absolute w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center">
                        <div className="absolute w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                          <span className="text-4xl">{moods[mood].emoji}</span>
                        </div>
                      </div>
                    </div>
                    <span className="capitalize text-sm md:text-base">
                      {mood}
                    </span>
                  </div>
                </motion.button>
              ))}
          </div>

          <div className="grid grid-cols-3 gap-5 md:gap-8 justify-center">
            {Object.keys(moods)
              .slice(4, 7)
              .map((mood) => (
                <motion.button
                  key={mood}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`rounded-full p-5 md:p-7 shadow-xl text-black font-semibold text-lg transition-all duration-300 
          ${moods[mood].color} ${moods[mood].hoverColor}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-400 flex items-center justify-center relative">
                      <div className="absolute w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center">
                        <div className="absolute w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                          <span className="text-4xl">{moods[mood].emoji}</span>
                        </div>
                      </div>
                    </div>
                    <span className="capitalize text-sm md:text-base">
                      {mood}
                    </span>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>

        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl bg-white/10 border border-white/20 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-lg mb-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-pink-400">
              {moods[selectedMood].emoji}{" "}
              {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
            </h2>
            <p className="mb-6 text-gray-200">
              {moods[selectedMood].description}
            </p>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {moods[selectedMood].actions.map((action) => (
                <motion.button
                  key={action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(action)}
                  className={`p-2 md:p-3 rounded-xl flex flex-col items-center ${
                    action === "Journal It"
                      ? "bg-blue-500/90 hover:bg-blue-600"
                      : action === "Play Music"
                      ? "bg-green-500/90 hover:bg-green-600"
                      : "bg-purple-500/90 hover:bg-purple-600"
                  }`}
                >
                  <span className="text-xl md:text-2xl mb-1">
                    {action === "Journal It"
                      ? "📝"
                      : action === "Play Music"
                      ? "🎵"
                      : "💡"}
                  </span>
                  <span className="text-xs md:text-sm">{action}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Journal Modal */}
        <AnimatePresence>
          {showActions === "journal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500/30 rounded-2xl p-8 w-full max-w-6xl shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Journal Your Feelings
                </h3>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-white mb-6 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                  placeholder="How are you feeling today?"
                  rows={8}
                  autoFocus
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowActions(false)}
                    className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveJournal}
                    disabled={!journalText.trim()}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition text-lg ${
                      !journalText.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Save Journal
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advice Modal */}
        <AnimatePresence>
          {showActions === "advice" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl"
              >
                <h3 className="text-xl font-bold mb-4 text-pink-400">
                  Advice for {selectedMood} Days
                </h3>
                <div className="space-y-3">
                  {[
                    "Take 3 deep breaths",
                    "Write down 3 things you're grateful for",
                    "Call a friend who makes you laugh",
                    "Go for a 10-minute walk",
                    "Listen to your favorite song",
                  ].map((advice, i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-3 rounded-lg border border-white/10"
                    >
                      <p className="text-gray-200">{advice}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowActions(false)}
                  className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}








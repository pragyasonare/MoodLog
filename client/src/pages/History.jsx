
// import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";
// import { CalendarIcon } from "@heroicons/react/24/outline";
// import Navbar from "../components/Navbar";

// export default function History() {
//   const { user } = useAuth();
//   const [journals, setJournals] = useState([]);
//   const [timeRange, setTimeRange] = useState("all");
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");

//   // Mood config matching your dashboard
//   const moods = {
//     happy: { emoji: "😊", color: "bg-yellow-300" },
//     sad: { emoji: "😢", color: "bg-blue-300" },
//     energetic: { emoji: "⚡", color: "bg-orange-300" },
//     calm: { emoji: "🍃", color: "bg-emerald-300" },
//     angry: { emoji: "😤", color: "bg-red-300" },
//     anxious: { emoji: "😰", color: "bg-indigo-300" },
//     fire: { emoji: "🔥", color: "bg-amber-300" },
//   };

//   useEffect(() => {
//     const fetchJournals = async () => {
//       try {
//         const res = await axios.get("/api/moods/history", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setJournals(res.data.filter((m) => m.note)); // Only entries with notes
//       } catch (err) {
//         console.error("Failed to fetch journals:", err);
//       }
//     };
//     fetchJournals();
//   }, []);

//   const filteredJournals = journals.filter((journal) => {
//     if (timeRange === "all") return true;
//     const days = timeRange === "7days" ? 7 : 30;
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - days);
//     return new Date(journal.createdAt) > cutoffDate;
//   });

//   const handleUpdateJournal = async (id) => {
//     try {
//       const res = await axios.patch(
//         `/api/moods/${id}`,
//         { note: editText },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setJournals(
//         journals.map((j) => (j._id === id ? { ...j, note: editText } : j))
//       );
//       setEditingId(null);
//     } catch (err) {
//       console.error("Failed to update journal:", err);
//       alert("Failed to update journal. Please try again.");
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 p-6 text-white">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
//             Your Journal History
//           </h1>

//           {/* Time range filters */}
//           <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-sm">
//             <CalendarIcon className="h-5 w-5 text-gray-300 ml-2" />
//             {["7days", "30days", "all"].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-3 py-1 text-sm rounded-full ${
//                   timeRange === range
//                     ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
//                     : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 {range === "7days"
//                   ? "Last 7 Days"
//                   : range === "30days"
//                   ? "Last 30 Days"
//                   : "All Time"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Journal Entries */}
//         <div className="space-y-4">
//           {filteredJournals.length === 0 ? (
//             <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center backdrop-blur-sm">
//               <p className="text-gray-400">No journal entries found</p>
//             </div>
//           ) : (
//             filteredJournals.map((journal) => (
//               <div
//                 key={journal._id}
//                 className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:border-white/20 transition-all"
//               >
//                 <div className="flex items-start gap-4">
//                   <span
//                     className={`text-2xl p-3 rounded-full ${
//                       moods[journal.moodType]?.color || "bg-gray-600"
//                     }`}
//                   >
//                     {moods[journal.moodType]?.emoji || "📝"}
//                   </span>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <h3 className="text-lg font-semibold capitalize">
//                         {journal.moodType}
//                       </h3>
//                       <span className="text-sm text-gray-400">
//                         {new Date(journal.createdAt).toLocaleString()}
//                       </span>
//                     </div>

//                     {editingId === journal._id ? (
//                       <div className="mt-3">
//                         <textarea
//                           value={editText}
//                           onChange={(e) => setEditText(e.target.value)}
//                           className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
//                           rows="3"
//                           maxLength="200"
//                         />
//                         <div className="flex gap-2 mt-2 justify-end">
//                           <button
//                             onClick={() => setEditingId(null)}
//                             className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             onClick={() => handleUpdateJournal(journal._id)}
//                             className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
//                           >
//                             Save
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="mt-2">
//                         <p className="text-gray-200">{journal.note}</p>
//                         <button
//                           onClick={() => {
//                             setEditingId(journal._id);
//                             setEditText(journal.note);
//                           }}
//                           className="mt-3 text-sm text-pink-400 hover:text-pink-300"
//                         >
//                           Edit Entry
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }



import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";

export default function History() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [timeRange, setTimeRange] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

 // Mood config matching your dashboard
  const moods = {
    happy: { emoji: "😊", color: "bg-yellow-300" },
    sad: { emoji: "😢", color: "bg-blue-300" },
    energetic: { emoji: "⚡", color: "bg-orange-300" },
    calm: { emoji: "🍃", color: "bg-emerald-300" },
    angry: { emoji: "😤", color: "bg-red-300" },
    anxious: { emoji: "😰", color: "bg-indigo-300" },
    fire: { emoji: "🔥", color: "bg-amber-300" },
  };

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await axios.get("/api/moods/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJournals(res.data.filter((m) => m.note)); // Only entries with notes
      } catch (err) {
        console.error("Failed to fetch journals:", err);
      }
    };
    fetchJournals();
  }, []);

  const filteredJournals = journals.filter((journal) => {
    if (timeRange === "all") return true;
    const days = timeRange === "7days" ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return new Date(journal.createdAt) > cutoffDate;
  });

  const handleUpdateJournal = async (id) => {
    try {
      await axios.patch(
        `/api/moods/${id}`,
        { note: editText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setJournals(
        journals.map((j) => (j._id === id ? { ...j, note: editText } : j))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update journal:", err);
      alert("Failed to update journal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white">
      <Navbar />
      <div className="pt-20 pb-10 px-6"> {/* Added padding-top to account for navbar */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Your Journal History
            </h1>

            {/* Time range filters */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-sm">
              <CalendarIcon className="h-5 w-5 text-gray-300 ml-2" />
              {["7days", "30days", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    timeRange === range
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {range === "7days"
                    ? "Last 7 Days"
                    : range === "30days"
                    ? "Last 30 Days"
                    : "All Time"}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Entries */}
          <div className="space-y-4">
            {filteredJournals.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center backdrop-blur-sm">
                <p className="text-gray-400">No journal entries found</p>
              </div>
            ) : (
              filteredJournals.map((journal) => (
                <div
                  key={journal._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-2xl p-3 rounded-full ${
                        moods[journal.moodType]?.color || "bg-gray-600"
                      }`}
                    >
                      {moods[journal.moodType]?.emoji || "📝"}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold capitalize">
                          {journal.moodType}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {new Date(journal.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {editingId === journal._id ? (
                        <div className="mt-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                            rows="3"
                            maxLength="200"
                          />
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateJournal(journal._id)}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="text-gray-200">{journal.note}</p>
                          <button
                            onClick={() => {
                              setEditingId(journal._id);
                              setEditText(journal.note);
                            }}
                            className="mt-3 text-sm text-pink-400 hover:text-pink-300"
                          >
                            Edit Entry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
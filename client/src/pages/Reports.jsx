// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// import { useAuth } from '../contexts/AuthContext';
// import MoodCalendar from '../components/MoodCalendar';
// import moods from '../utils/moods';

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function Reports() {
//   const { token, logout } = useAuth(); // Added logout from auth context
//   const [insights, setInsights] = useState(null);
//   const [timeRange, setTimeRange] = useState('this-week');
//   const [loading, setLoading] = useState(true); // Added loading state
//   const [error, setError] = useState(null); // Added error state

//   // Enhanced fetchInsights function with error handling
//   const fetchInsights = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const endpoint = timeRange === 'this-week'
//         ? '/api/moods/insights/weekly'
//         : `/api/moods/insights/historical?range=${timeRange}`;

//       const res = await axios.get(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('API Response:', res.data); // Debug logging

//       if (res.data.success) {
//         setInsights(res.data);
//       } else {
//         throw new Error(res.data.error || 'Unknown API error');
//       }
//     } catch (err) {
//       console.error('Request Failed:', err.response?.data || err.message);
//       setError(err.response?.data?.error || err.message);

//       // Handle token expiration
//       if (err.response?.data?.code === 'TOKEN_EXPIRED') {
//         logout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchInsights();
//     }
//   }, [token, timeRange]);

//   const chartData = useMemo(() => {
//     if (!insights?.moodDistribution) return null;

//     return {
//       labels: insights.moodDistribution.map(m => m.mood),
//       datasets: [{
//         data: insights.moodDistribution.map(m => m.count),
//         backgroundColor: insights.moodDistribution.map(m => moods[m.mood]?.color),
//         borderWidth: 0,
//       }]
//     };
//   }, [insights]);

//   // Updated return with loading and error states
//   return (
//     <div className="p-4 md:p-8 space-y-8 bg-gray-900 min-h-screen">
//       <MoodCalendar />

//       <div className="bg-gray-900/80 p-5 rounded-2xl border-2 border-purple-500/50 backdrop-blur-sm shadow-xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
//             Mood Statistics
//           </h2>
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="bg-gray-800 border-2 border-purple-500/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
//             disabled={loading} // Disable during loading
//           >
//             <option value="this-week">This Week</option>
//             <option value="last-week">Last Week</option>
//             <option value="last-month">Last Month</option>
//           </select>
//         </div>

//         {loading ? (
//           <div className="h-64 flex items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
//             <h3 className="text-red-300 font-bold">Error</h3>
//             <p>{error}</p>
//             <button
//               onClick={fetchInsights}
//               className="mt-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
//             >
//               Retry
//             </button>
//           </div>
//         ) : insights ? (
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="space-y-6">
//               <div className="bg-gray-800/50 p-5 rounded-xl border-2 border-purple-500/30">
//                 <h3 className="text-lg font-semibold mb-3 text-purple-200">Mood Distribution</h3>
//                 <div className="h-64">
//                   <Pie
//                     data={chartData}
//                     options={{
//                       plugins: {
//                         legend: {
//                           position: 'right',
//                           labels: {
//                             color: '#E2E8F0',
//                             font: {
//                               size: 14,
//                               family: "'Inter', sans-serif"
//                             },
//                             padding: 20,
//                             usePointStyle: true,
//                             pointStyle: 'circle'
//                           }
//                         }
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-5 rounded-xl border-2 border-white/20">
//                 <h3 className="text-lg font-semibold mb-4 text-white">Mood Frequency</h3>
//                 <div className="space-y-4">
//                   {insights.moodDistribution.map((mood, i) => (
//                     <div key={`mood-${i}`} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
//                       <span className={`text-3xl p-3 rounded-full ${moods[mood.mood]?.color} flex items-center justify-center`}>
//                         {moods[mood.mood]?.emoji}
//                       </span>
//                       <div className="flex-1">
//                         <div className="flex justify-between mb-2">
//                           <span className="font-bold capitalize text-white">{mood.mood}</span>
//                           <span className="text-purple-300 font-mono">{mood.count} days</span>
//                         </div>
//                         <div className="w-full bg-gray-700/50 rounded-full h-2.5">
//                           <div
//                             className="h-2.5 rounded-full animate-grow"
//                             style={{
//                               width: `${(mood.count / insights.totalEntries) * 100}%`,
//                               backgroundColor: moods[mood.mood]?.color,
//                               boxShadow: `0 0 8px ${moods[mood.mood]?.color}`
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="text-5xl mb-4">📊</div>
//             <h3 className="text-xl font-bold text-purple-300 mb-2">No data yet!</h3>
//             <p className="text-gray-400">Start logging your moods to see beautiful statistics</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

////////////////////////////////////////////////////////////////////////////////////////////////////// favoriteee

// // Reports.js
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import MoodCalendar from '../components/MoodCalendar';
// import moods from '../utils/moods';

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function Reports() {
//   // ================================================
//   // 1. State Management
//   // ================================================
//   const { token, logout } = useAuth();
//   const navigate = useNavigate();
//   const [insights, setInsights] = useState(null);
//   const [timeRange, setTimeRange] = useState('this-week');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ================================================
//   // 2. Data Fetching with Error Handling
//   // ================================================
//   const fetchInsights = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await axios.get('/api/moods/insights/weekly', {
//         params: { range: timeRange },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (res.data.success) {
//         setInsights(res.data);
//       } else {
//         throw new Error(res.data.error || 'Failed to load insights');
//       }
//     } catch (err) {
//       console.error('Fetch insights error:', err);
//       setError(err.response?.data?.error || err.message);
//       if (err.response?.data?.code === 'TOKEN_EXPIRED') logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================================
//   // 3. Effects and Data Processing
//   // ================================================
//   useEffect(() => {
//     if (token) fetchInsights();
//   }, [token, timeRange]);

//   const chartData = useMemo(() => {
//     if (!insights?.moodDistribution) return null;

//     return {
//       labels: insights.moodDistribution.map(m => m.mood),
//       datasets: [{
//         data: insights.moodDistribution.map(m => m.percentage),
//         backgroundColor: insights.moodDistribution.map(m =>
//           moods[m.mood]?.color || '#9CA3AF'
//         ),
//         borderWidth: 0,
//       }]
//     };
//   }, [insights]);

//   // ================================================
//   // 4. UI Helpers
//   // ================================================
//   const getEmptyStateIcon = () => {
//     switch (timeRange) {
//       case 'last-week': return '🕰️';
//       case 'last-month': return '📅';
//       default: return '🌤️';
//     }
//   };

//   const getTimeRangeLabel = () => {
//     switch (timeRange) {
//       case 'last-week': return 'Last Week';
//       case 'last-month': return 'Last Month';
//       default: return 'This Week';
//     }
//   };

//   // ================================================
//   // 5. Main Render
//   // ================================================
//   return (
//     <div className="p-4 md:p-8 space-y-8 bg-gray-900 min-h-screen">
//       <MoodCalendar />

//       <div className="bg-gray-900/80 p-5 rounded-2xl border-2 border-purple-500/50 backdrop-blur-sm shadow-xl">
//         {/* Header Section */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
//             {getTimeRangeLabel()} Stats
//           </h2>
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="bg-gray-800 border-2 border-purple-500/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
//             disabled={loading}
//           >
//             <option value="this-week">This Week</option>
//             <option value="last-week">Last Week</option>
//             <option value="last-month">Last Month</option>
//           </select>
//         </div>

//         {/* ================================================ */}
//         {/* 6. Conditional Rendering */}
//         {/* ================================================ */}
//         {loading ? (
//           <LoadingState />
//         ) : error ? (
//           <ErrorState error={error} onRetry={fetchInsights} />
//         ) : insights?.isEmpty ? (
//           <EmptyState
//             icon={getEmptyStateIcon()}
//             message={insights.message}
//             onNavigate={() => navigate('/log-mood')}
//           />
//         ) : insights?.moodDistribution?.length > 0 ? (
//           <DataVisualization
//             chartData={chartData}
//             moodDistribution={insights.moodDistribution}
//           />
//         ) : (
//           <FallbackState />
//         )}
//       </div>
//     </div>
//   );
// }

// // ================================================
// // 7. Sub-Components
// // ================================================
// const LoadingState = () => (
//   <div className="h-64 flex items-center justify-center">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//   </div>
// );

// const ErrorState = ({ error, onRetry }) => (
//   <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
//     <h3 className="text-red-300 font-bold">Error</h3>
//     <p>{error}</p>
//     <button
//       onClick={onRetry}
//       className="mt-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
//     >
//       Retry
//     </button>
//   </div>
// );

// const EmptyState = ({ icon, message, onNavigate }) => (
//   <div className="text-center py-12 animate-fade-in">
//     <div className="text-5xl mb-4">{icon}</div>
//     <h3 className="text-xl font-bold text-purple-300 mb-2">
//       {message || "No mood data found"}
//     </h3>

//   </div>
// );

// const DataVisualization = ({ chartData, moodDistribution }) => (
//   <div className="grid md:grid-cols-2 gap-8">
//     {/* Pie Chart Section */}
//     <div className="space-y-6">
//       <div className="bg-gray-800/50 p-5 rounded-xl border-2 border-purple-500/30">
//         <h3 className="text-lg font-semibold mb-3 text-purple-200">
//           Mood Distribution
//         </h3>
//         <div className="h-64">
//           <Pie
//             data={chartData}
//             options={{
//               plugins: {
//                 legend: {
//                   position: 'right',
//                   labels: {
//                     color: '#E2E8F0',
//                     font: { size: 14, family: "'Inter', sans-serif" },
//                     padding: 20,
//                     usePointStyle: true,
//                     pointStyle: 'circle'
//                   }
//                 }
//               }
//             }}
//           />
//         </div>
//       </div>
//     </div>

//     {/* Mood Frequency Bars */}
//     <div className="space-y-6">
//       <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-5 rounded-xl border-2 border-white/20">
//         <h3 className="text-lg font-semibold mb-4 text-white">
//           Mood Frequency
//         </h3>
//         <div className="space-y-4">
//           {moodDistribution.map((mood, i) => (
//             <MoodBar key={`mood-${i}`} mood={mood} />
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const MoodBar = ({ mood }) => (
//   <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
//     <span className={`text-3xl p-3 rounded-full ${moods[mood.mood]?.color || 'bg-gray-400'} flex items-center justify-center`}>
//       {moods[mood.mood]?.emoji || '🤔'}
//     </span>
//     <div className="flex-1">
//       <div className="flex justify-between mb-2">
//         <span className="font-bold capitalize text-white">
//           {mood.mood}
//         </span>
//         <span className="text-purple-300 font-mono">
//           {mood.percentage}%
//         </span>
//       </div>
//       <div className="w-full bg-gray-700/50 rounded-full h-2.5">
//         <div
//           className="h-2.5 rounded-full animate-grow"
//           style={{
//             width: `${mood.percentage}%`,
//             backgroundColor: moods[mood.mood]?.color || '#9CA3AF',
//             boxShadow: `0 0 8px ${moods[mood.mood]?.color || '#9CA3AF'}`
//           }}
//         ></div>
//       </div>
//     </div>
//   </div>
// );

// const FallbackState = () => (
//   <div className="text-center py-12">
//     <div className="text-5xl mb-4">📊</div>
//     <h3 className="text-xl font-bold text-purple-300 mb-2">
//       No data available
//     </h3>
//   </div>
// );

//////////////////////////////////// ---- horizontally besttt

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../contexts/AuthContext';
// import MoodCalendar from '../components/MoodCalendar';
// import moods from '../utils/moods';

// export default function Reports() {
//   const { token, logout } = useAuth();
//   const [insights, setInsights] = useState(null);
//   const [timeRange, setTimeRange] = useState('last-week');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchInsights = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await axios.get('/api/moods/insights/weekly', {
//         params: { range: timeRange },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (res.data.success) {
//         setInsights(res.data);
//       } else {
//         throw new Error(res.data.error || 'Failed to load insights');
//       }
//     } catch (err) {
//       console.error('Fetch insights error:', err);
//       setError(err.response?.data?.error || err.message);
//       if (err.response?.data?.code === 'TOKEN_EXPIRED') logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchInsights();
//   }, [token, timeRange]);

//   const getDominantMood = () => {
//     if (!insights?.moodDistribution || insights.moodDistribution.length === 0) {
//       return null;
//     }

//     return insights.moodDistribution.reduce((prev, current) =>
//       (prev.percentage > current.percentage) ? prev : current
//     );
//   };

//   const dominantMood = getDominantMood();

//   const getTimeRangeLabel = () => {
//     switch (timeRange) {
//       case 'last-week': return 'Last Week';
//       case 'last-month': return 'Last Month';
//       default: return 'This Week';
//     }
//   };

//   return (
//     <div className="p-4 md:p-8 space-y-6 bg-gray-900 min-h-screen">
//       {/* 1. Mood Calendar (unchanged) */}
//       <MoodCalendar />

//       {/* 2. Last Week's Dominant Mood */}
//       <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
//         <h2 className="text-xl font-bold text-purple-300 mb-4">Last Week's Dominant Mood</h2>
//         {loading ? (
//           <div className="h-48 flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-300">{error}</div>
//         ) : dominantMood ? (
//           <div className="flex flex-col items-center justify-center h-48">
//             <span className="text-6xl mb-3">
//               {moods[dominantMood.mood]?.emoji || '🤔'}
//             </span>
//             <span className="text-2xl font-bold capitalize text-white">
//               {dominantMood.mood}
//             </span>
//             <span className="text-purple-300 mt-1">
//               {dominantMood.percentage}% of your entries
//             </span>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-48">
//             <span className="text-6xl mb-3">📅</span>
//             <span className="text-xl text-gray-400">
//               You didn't show up last week
//             </span>
//           </div>
//         )}
//       </div>

//       {/* 3. Mood Frequency Bars with Time Filter */}
//       <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-purple-300">Mood Frequency</h2>
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="bg-gray-800 border-2 border-purple-500/50 rounded-xl px-3 py-1 text-white focus:outline-none"
//             disabled={loading}
//           >
//             <option value="this-week">This Week</option>
//             <option value="last-week">Last Week</option>
//             <option value="last-month">Last Month</option>
//           </select>
//         </div>

//         <div className="text-sm text-purple-400 mb-4">
//           Showing: {getTimeRangeLabel()}
//         </div>

//         {loading ? (
//           <div className="h-48 flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-300">{error}</div>
//         ) : insights?.moodDistribution?.length > 0 ? (
//           <div className="space-y-4 py-2">
//             {insights.moodDistribution.map((mood, i) => (
//               <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
//                 <span className={`text-3xl p-3 rounded-full ${moods[mood.mood]?.color || 'bg-gray-400'}`}>
//                   {moods[mood.mood]?.emoji || '🤔'}
//                 </span>
//                 <div className="flex-1">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold capitalize text-white">
//                       {mood.mood}
//                     </span>
//                     <span className="text-purple-300 font-mono">
//                       {mood.percentage}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-700/50 rounded-full h-2.5">
//                     <div
//                       className="h-2.5 rounded-full"
//                       style={{
//                         width: `${mood.percentage}%`,
//                         backgroundColor: moods[mood.mood]?.color || '#9CA3AF',
//                         boxShadow: `0 0 8px ${moods[mood.mood]?.color || '#9CA3AF'}`
//                       }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-48">
//             <span className="text-6xl mb-3">📊</span>
//             <span className="text-xl text-gray-400">
//               No mood data available for {getTimeRangeLabel()}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import MoodCalendar from "../components/MoodCalendar";
// import moods from "../utils/moods";
// import Navbar from "../components/Navbar";
// import { calculateStreak } from "../utils/streakUtils";

// export default function Reports() {
//   const { token, logout } = useAuth();
//   const [insights, setInsights] = useState(null);
//   const [timeRange, setTimeRange] = useState("last-week");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [dateEntries, setDateEntries] = useState([]);
//   const [streak, setStreak] = useState(0);

//   // const fetchInsights = async () => {
//   //   try {
//   //     setLoading(true);
//   //     setError(null);

//   //     const res = await axios.get('/api/moods/insights/weekly', {
//   //       params: { range: timeRange },
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         'Content-Type': 'application/json'
//   //       }
//   //     });

//   //     if (res.data.success) {
//   //       setInsights(res.data);
//   //     } else {
//   //       throw new Error(res.data.error || 'Failed to load insights');
//   //     }
//   //   } catch (err) {
//   //     console.error('Fetch insights error:', err);
//   //     setError(err.response?.data?.error || err.message);
//   //     if (err.response?.data?.code === 'TOKEN_EXPIRED') logout();
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchInsights = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [insightsRes, historyRes] = await Promise.all([
//         axios.get("/api/moods/insights/weekly", {
//           params: { range: timeRange },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }),
//         axios.get("/api/moods/history", {
//           // Fetch history for streak calculation
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (insightsRes.data.success) {
//         setInsights(insightsRes.data);
//         setStreak(calculateStreak(historyRes.data)); // Calculate streak
//       } else {
//         throw new Error(insightsRes.data.error || "Failed to load insights");
//       }
//     } catch (err) {
//       console.error("Fetch insights error:", err);
//       setError(err.response?.data?.error || err.message);
//       if (err.response?.data?.code === "TOKEN_EXPIRED") logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDateEntries = async (date) => {
//     try {
//       const res = await axios.get("/api/moods/entries", {
//         params: { date },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setDateEntries(res.data.entries || []);
//     } catch (err) {
//       console.error("Fetch entries error:", err);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchInsights();
//   }, [token, timeRange]);

//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     fetchDateEntries(date);
//   };

//   const getDominantMood = () => {
//     if (!insights?.moodDistribution || insights.moodDistribution.length === 0) {
//       return null;
//     }

//     return insights.moodDistribution.reduce((prev, current) =>
//       prev.percentage > current.percentage ? prev : current
//     );
//   };

//   const dominantMood = getDominantMood();

//   const getTimeRangeLabel = () => {
//     switch (timeRange) {
//       case "last-week":
//         return "Last Week";
//       case "last-month":
//         return "Last Month";
//       default:
//         return "This Week";
//     }
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen">
//       {/* Navbar at the top */}
//       <Navbar />

//       <div className="pt-20 pb-10 px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column - Calendar with Entries */}
//           <div className="lg:sticky lg:top-20 h-fit space-y-6">
//             <MoodCalendar onDateClick={handleDateClick} />

//             {/* Date Entries Section */}
//             <div
//               className={`bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30 transition-all duration-300 ${
//                 selectedDate ? "block" : "hidden"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-purple-300">
//                   Entries for {selectedDate}
//                 </h2>
//                 <button
//                   onClick={() => setSelectedDate(null)}
//                   className="text-2xl text-red-400 hover:text-red-300"
//                 >
//                   ×
//                 </button>
//               </div>

//               {dateEntries.length > 0 ? (
//                 <div className="space-y-3">
//                   {dateEntries.map((entry, i) => (
//                     <div key={i} className="bg-white/5 p-4 rounded-lg">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span
//                           className={`text-2xl p-2 rounded-full ${
//                             moods[entry.mood]?.color || "bg-gray-400"
//                           }`}
//                         >
//                           {moods[entry.mood]?.emoji || "🤔"}
//                         </span>
//                         <span className="font-bold capitalize text-white">
//                           {entry.mood}
//                         </span>
//                       </div>
//                       <p className="text-gray-300">{entry.note}</p>
//                       {entry.tags?.length > 0 && (
//                         <div className="mt-2 flex flex-wrap gap-2">
//                           {entry.tags.map((tag) => (
//                             <span
//                               key={tag}
//                               className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded"
//                             >
//                               #{tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-400">
//                   No entries for this date
//                 </div>
//               )}
//             </div>

//             {/* Stats Summary (filling empty space) */}
//             {!selectedDate && (
//               <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
//                 <h2 className="text-xl font-bold text-purple-300 mb-4">
//                   Quick Stats
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Current Streak (unchanged) */}
//                   <div className="bg-gray-700/40 p-4 rounded-lg">
//                     <div className="flex items-center justify-center gap-2">
//                       <span className="text-6xl">🔥</span>
//                       <div>
//                         <div className="text-sm text-gray-300">
//                           Current Streak
//                         </div>
//                         <div className="text-2xl font-bold text-white">
//                           {streak > 0
//                             ? `${streak} day${streak !== 1 ? "s" : ""}`
//                             : "--"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Most Frequent Mood - Now with dynamic emoji */}
//                   <div className="bg-gray-700/40 p-4 rounded-lg">
//                     <div className="flex items-center justify-center gap-2">
//                       <span className="text-6xl">
//                         {dominantMood ? (
//                           <span
//                             className={
//                               moods[dominantMood.mood]?.color || "text-blue-400"
//                             }
//                             style={{ display: "inline-block" }}
//                           >
//                             {moods[dominantMood.mood]?.emoji || "😊"}
//                           </span>
//                         ) : (
//                           <span className="text-blue-400">😊</span>
//                         )}
//                       </span>
//                       <div>
//                         <div className="text-sm text-gray-300">
//                           Most Frequent Mood
//                         </div>
//                         <div className="text-2xl font-bold text-white capitalize">
//                           {dominantMood?.mood || "--"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Stacked Sections */}
//           <div className="space-y-6">
//             {/* Dominant Mood */}
//             <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
//               <h2 className="text-xl font-bold text-purple-300 mb-4">
//                 Last Week's Dominant Mood
//               </h2>
//               {loading ? (
//                 <div className="h-48 flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//                 </div>
//               ) : error ? (
//                 <div className="text-red-300">{error}</div>
//               ) : dominantMood ? (
//                 <div className="flex flex-col items-center justify-center h-48">
//                   <span className="text-6xl mb-3">
//                     {moods[dominantMood.mood]?.emoji || "🤔"}
//                   </span>
//                   <span className="text-2xl font-bold capitalize text-white">
//                     {dominantMood.mood}
//                   </span>
//                   <span className="text-purple-300 mt-1">
//                     {dominantMood.percentage}% of your entries
//                   </span>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-48">
//                   <span className="text-6xl mb-3">📅</span>
//                   <span className="text-xl text-gray-400">
//                     You didn't show up last week
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Mood Frequency */}
//             <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-purple-300">
//                   Mood Frequency
//                 </h2>
//                 <select
//                   value={timeRange}
//                   onChange={(e) => setTimeRange(e.target.value)}
//                   className="bg-gray-800 border-2 border-purple-500/50 rounded-xl px-3 py-1 text-white focus:outline-none"
//                   disabled={loading}
//                 >
//                   <option value="this-week">This Week</option>
//                   <option value="last-week">Last Week</option>
//                   <option value="last-month">Last Month</option>
//                 </select>
//               </div>

//               <div className="text-sm text-purple-400 mb-4">
//                 Showing: {getTimeRangeLabel()}
//               </div>

//               {loading ? (
//                 <div className="h-48 flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//                 </div>
//               ) : error ? (
//                 <div className="text-red-300">{error}</div>
//               ) : insights?.moodDistribution?.length > 0 ? (
//                 <div className="space-y-4 py-2">
//                   {insights.moodDistribution.map((mood, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
//                     >
//                       <span
//                         className={`text-3xl p-3 rounded-full ${
//                           moods[mood.mood]?.color || "bg-gray-400"
//                         }`}
//                       >
//                         {moods[mood.mood]?.emoji || "🤔"}
//                       </span>
//                       <div className="flex-1">
//                         <div className="flex justify-between mb-2">
//                           <span className="font-bold capitalize text-white">
//                             {mood.mood}
//                           </span>
//                           <span className="text-purple-300 font-mono">
//                             {mood.percentage}%
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-700/50 rounded-full h-2.5">
//                           <div
//                             className="h-2.5 rounded-full"
//                             style={{
//                               width: `${mood.percentage}%`,
//                               backgroundColor:
//                                 moods[mood.mood]?.color || "#9CA3AF",
//                               boxShadow: `0 0 8px ${
//                                 moods[mood.mood]?.color || "#9CA3AF"
//                               }`,
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-48">
//                   <span className="text-6xl mb-3">📊</span>
//                   <span className="text-xl text-gray-400">
//                     No mood data available for {getTimeRangeLabel()}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import MoodCalendar from '../components/MoodCalendar';
import moods from '../utils/moods';
import Navbar from '../components/Navbar';
import { calculateStreak } from '../utils/streakUtils';

export default function Reports() {
  const { token, logout } = useAuth();
  const [insights, setInsights] = useState(null);
  const [timeRange, setTimeRange] = useState('last-week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateEntries, setDateEntries] = useState([]);
  const [streak, setStreak] = useState(0);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [insightsRes, historyRes] = await Promise.all([
        axios.get('/api/moods/insights/weekly', {
          params: { range: timeRange },
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('/api/moods/history', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (insightsRes.data.success) {
        setInsights(insightsRes.data);
        setStreak(calculateStreak(historyRes.data));
      } else {
        throw new Error(insightsRes.data.error || 'Failed to load insights');
      }
    } catch (err) {
      console.error('Fetch insights error:', err);
      setError(err.response?.data?.error || err.message);
      if (err.response?.data?.code === 'TOKEN_EXPIRED') logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchDateEntries = async (date) => {
    try {
      const res = await axios.get('/api/moods/entries', {
        params: { date },
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDateEntries(res.data.entries || []);
    } catch (err) {
      console.error('Fetch entries error:', err);
    }
  };

  useEffect(() => {
    if (token) fetchInsights();
  }, [token, timeRange]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchDateEntries(date);
  };

  const getDominantMood = () => {
    if (!insights?.moodDistribution || insights.moodDistribution.length === 0) {
      return null;
    }
    
    return insights.moodDistribution.reduce((prev, current) => 
      (prev.percentage > current.percentage) ? prev : current
    );
  };

  const dominantMood = getDominantMood();

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'last-week': return 'Last Week';
      case 'last-month': return 'Last Month';
      default: return 'This Week';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navbar at the top */}
      <Navbar />
      
      <div className="pt-20 pb-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Calendar with Entries */}
          <div className="lg:sticky lg:top-20 h-fit space-y-6">
            <MoodCalendar onDateClick={handleDateClick} />
            
            {/* Date Entries Section */}
            <div className={`bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30 transition-all duration-300 ${selectedDate ? 'block' : 'hidden'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-300">
                  Entries for {selectedDate}
                </h2>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-2xl text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
              
              {dateEntries.length > 0 ? (
                <div className="space-y-3">
                  {dateEntries.map((entry, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-2xl p-2 rounded-full ${moods[entry.mood]?.color || 'bg-gray-400'}`}>
                          {moods[entry.mood]?.emoji || '🤔'}
                        </span>
                        <span className="font-bold capitalize text-white">
                          {entry.mood}
                        </span>
                      </div>
                      <p className="text-gray-300">{entry.note}</p>
                      {entry.tags?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {entry.tags.map(tag => (
                            <span key={tag} className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No entries for this date
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {!selectedDate && (
              <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
                <h2 className="text-xl font-bold text-purple-300 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Last Week's Dominant Mood */}
                  <div className="bg-gray-700/40 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-6xl">
                        {dominantMood ? (
                          <span className={moods[dominantMood.mood]?.color || 'text-purple-400'}>
                            {moods[dominantMood.mood]?.emoji || '🤔'}
                          </span>
                        ) : (
                          <span className="text-purple-400">📅</span>
                        )}
                      </span>
                      <div>
                        <div className="text-sm text-gray-300">
                         Frequent Mood
                        </div>
                        <div className="text-2xl font-bold text-white capitalize">
                          {dominantMood?.mood || "--"}
                        </div>
                        {dominantMood && (
                          <div className="text-xs text-purple-300">
                            {dominantMood.percentage}% of entries
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Streak */}
                  <div className="bg-gray-700/40 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-6xl">🔥</span>
                      <div>
                        <div className="text-sm text-gray-300">
                          Current Streak
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {streak > 0 ? `${streak} day${streak !== 1 ? "s" : ""}` : "--"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Mood Frequency Only */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-300">Mood Frequency</h2>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-800 border-2 border-purple-500/50 rounded-xl px-3 py-1 text-white focus:outline-none"
                  disabled={loading}
                >
                  <option value="this-week">This Week</option>
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                </select>
              </div>
              
              <div className="text-sm text-purple-400 mb-4">
                Showing: {getTimeRangeLabel()}
              </div>

              {loading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-300">{error}</div>
              ) : insights?.moodDistribution?.length > 0 ? (
                <div className="space-y-4 py-2">
                  {insights.moodDistribution.map((mood, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <span className={`text-3xl p-3 rounded-full ${moods[mood.mood]?.color || 'bg-gray-400'}`}>
                        {moods[mood.mood]?.emoji || '🤔'}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold capitalize text-white">
                            {mood.mood}
                          </span>
                          <span className="text-purple-300 font-mono">
                            {mood.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${mood.percentage}%`,
                              backgroundColor: moods[mood.mood]?.color || '#9CA3AF',
                              boxShadow: `0 0 8px ${moods[mood.mood]?.color || '#9CA3AF'}`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  <span className="text-6xl mb-3">📊</span>
                  <span className="text-xl text-gray-400">
                    No mood data available for {getTimeRangeLabel()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

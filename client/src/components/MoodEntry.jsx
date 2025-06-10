// // src/components/MoodEntry.jsx
// export default function MoodEntry({ mood }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow mb-2">
//       <div className="flex items-center gap-2">
//         <span className="text-2xl">
//           {mood.moodType === 'happy' ? '😊' : 
//            mood.moodType === 'sad' ? '😢' : '⚡'}
//         </span>
//         <p className="capitalize">{mood.moodType}</p>
//         <span className="text-sm text-gray-500 ml-auto">
//           {new Date(mood.createdAt).toLocaleString()}
//         </span>
//       </div>
//       <MoodNote mood={mood} />
//     </div>
//   );
// }
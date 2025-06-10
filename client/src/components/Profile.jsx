// // src/components/Profile.jsx
// import { useAuth } from '../contexts/AuthContext';

// export default function Profile() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <h2 className="text-xl font-semibold">Your Profile</h2>
//       <p className="mt-2">Email: {user?.email}</p>
//       <p>Joined: {new Date(user?.createdAt).toLocaleDateString()}</p>
//       <button 
//         onClick={logout}
//         className="mt-4 btn-primary"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }
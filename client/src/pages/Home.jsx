// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in">
           MoodLog 💭
        </h1>
        <h1 className="text-5xl md:text-4xl font-extrabold text-white mb-6 animate-fade-in">
            A Start to reflect, track, and grow.
        </h1>

        <p className="text-xl text-purple-100 mb-10 opacity-90">
          {/* Discover personalized playlists that match your mood perfectly. 
          Let the music heal, energize, or relax you. */}
          Track your mood, journal your thoughts, and unlock perfectly matched music - all in one emotional wellness hub
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/login" 
            className="px-8 py-3 bg-white text-purple-900 font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-purple-500 rounded-full filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-20 w-24 h-24 bg-pink-500 rounded-full filter blur-xl opacity-20 animate-float-delay"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-indigo-500 rounded-full filter blur-xl opacity-20 animate-float-delay-2"></div>
      </div>
    </div>
  );
}
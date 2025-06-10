import React from 'react';

export default function PlaylistCard({ mood, playlistId, activity }) {
  return (
    <div className="bg-white text-black rounded-2xl shadow-2xl p-8 text-center max-w-md w-full transition-all duration-300">
      <h2 className="text-2xl font-bold text-pink-600 mb-2 capitalize">
        Your {mood} Playlist
      </h2>
      <p className="mb-6 text-sm text-gray-600 italic">{activity}</p>
      <a
        href={`https://open.spotify.com/playlist/${playlistId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 text-sm inline-block"
      >
        🎵 Open in Spotify
      </a>
    </div>
  );
}

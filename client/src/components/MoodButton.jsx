// src/components/MoodButton.jsx
export default function MoodButton({ mood, emoji, color, hoverColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-40 h-28 rounded-xl shadow-md text-lg font-medium text-black transition-all duration-300 transform hover:scale-105 ${color} ${hoverColor}`}
    >
      <span className="text-3xl mb-2">{emoji}</span>
      {mood.charAt(0).toUpperCase() + mood.slice(1)}
    </button>
  );
}

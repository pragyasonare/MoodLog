
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moods from '../utils/moods';
import { calculateStreak } from '../utils/streakUtils';

const MoodCalendar = ({ onCloseEntries }) => {
  const { token } = useAuth();
  const [moodData, setMoodData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/moods/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoodData(res.data);
      } catch (err) {
        console.error("Failed to load mood data", err);
      }
    };
    if (token) fetchData();
  }, [token]);

  const getDayMoodStats = (date) => {
    const entries = moodData.filter(e => 
      new Date(e.createdAt).toDateString() === date.toDateString()
    );
    
    if (entries.length === 0) return null;
    
    const moodCounts = {};
    entries.forEach(entry => {
      moodCounts[entry.moodType] = (moodCounts[entry.moodType] || 0) + 1;
    });
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    
    return {
      mood: dominantMood,
      count: entries.length,
      entries
    };
  };

  const handleDateClick = (date) => {
    const stats = getDayMoodStats(date);
    if (selectedDate && selectedDate.date && selectedDate.date.toDateString() === date.toDateString()) {
      handleCloseEntries();
    } else {
      setSelectedDate(stats ? { date, ...stats } : date);
    }
  };

  const handleCloseEntries = () => {
    setSelectedDate(null);
    if (onCloseEntries) {
      onCloseEntries();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedDate && !e.target.closest('.calendar-day, .date-details')) {
        handleCloseEntries();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDate]);

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    return (
      <div className="relative">
        <div className="grid grid-cols-7 gap-1 p-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`weekday-${index}`} className="text-center text-sm text-purple-300 pb-2 font-bold">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dayStats = getDayMoodStats(date);
            const isSelected = selectedDate && selectedDate.date && 
              selectedDate.date.toDateString() === date.toDateString();

            return (
              <button
                key={`day-${day}`}
                className={`calendar-day relative h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${dayStats ? `${moods[dayStats.mood]?.color} cursor-pointer` : 'bg-gray-800/30'}
                  ${hoveredDay === day ? 'transform scale-110 z-10 shadow-lg' : ''}
                  ${isSelected ? 'ring-4 ring-white/50 animate-pulse' : ''}
                  border-2 ${dayStats ? moods[dayStats.mood]?.borderColor : 'border-gray-600'}`}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => handleDateClick(date)}
              >
                {dayStats ? (
                  <>
                    <span className="text-2xl">{moods[dayStats.mood]?.emoji}</span>
                    {dayStats.count > 1 && (
                      <span className="absolute bottom-1 right-1 text-xs font-bold bg-black/50 rounded-full w-4 h-4 flex items-center justify-center">
                        {dayStats.count}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">{day}</span>
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="date-details absolute -bottom-20 left-0 right-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80 p-4 rounded-xl border-2 border-white/20 backdrop-blur-sm z-20">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {selectedDate.mood ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl ${moods[selectedDate.mood]?.color}`}>
                        {moods[selectedDate.mood]?.emoji}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold capitalize">{selectedDate.mood}</h3>
                        <p className="text-purple-200">
                          {selectedDate.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-white/70">
                          {selectedDate.count} {selectedDate.count === 1 ? 'entry' : 'entries'}
                        </p>
                      </div>
                    </div>
                    {selectedDate.entries?.some(e => e.note) && (
                      <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                        {selectedDate.entries.map((entry, i) => (
                          entry.note && (
                            <p key={`note-${i}`} className="text-white/80 italic text-sm">
                              "{entry.note}"
                            </p>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-white/70">No entry for {selectedDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={handleCloseEntries}
                className="text-2xl text-white/70 hover:text-white ml-2"
                aria-label="Close entries"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const streak = calculateStreak(moodData);

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border-2 border-purple-500/50 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Mood Calendar 
          {/* {streak > 0 && <span className="text-white">🔥 {streak} day streak</span>} */}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-pink-600/30 transition-colors text-white"
          >
            ←
          </button>
          <span className="font-bold text-white px-4 py-1 bg-purple-900/40 rounded-xl">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-pink-600/30 transition-colors text-white"
          >
            →
          </button>
        </div>
      </div>

      {renderCalendar()}
    </div>
  );
};

export default MoodCalendar;
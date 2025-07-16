
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

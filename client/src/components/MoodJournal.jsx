import { useState } from 'react';
import axios from 'axios';

export default function MoodJournal({ mood }) {
  const [note, setNote] = useState('');

  const handleSave = async () => {
    try {
      await axios.patch('https://moodlog.onrender.com/api/moods/latest', { note });
      alert('Journal saved!');
    } catch (err) {
      alert('Failed to save journal entry');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Journal Your {mood} Feelings</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="How are you really feeling today?"
        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        rows="4"
      />
      <button
        onClick={handleSave}
        className="mt-3 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full"
      >
        Save Journal
      </button>
    </div>
  );
}

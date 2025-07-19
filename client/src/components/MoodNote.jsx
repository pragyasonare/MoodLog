// src/components/MoodNote.jsx
import { useState } from 'react';
import axios from 'axios';

export default function MoodNote({ mood, onUpdate }) {
  const [note, setNote] = useState(mood.note || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await axios.patch(`https://moodlog.onrender.com/api/moods/${mood._id}
`, { note });
      onUpdate();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-2">
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 p-2 border rounded"
            maxLength={200}
          />
          <button onClick={handleSave} className="btn-primary">
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          {note || <span className="text-gray-400">Click to add a note...</span>}
        </div>
      )}
    </div>
  );
}

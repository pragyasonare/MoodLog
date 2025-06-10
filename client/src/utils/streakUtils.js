// src/utils/streakUtils.js
export const calculateStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;
  
  const today = new Date();
  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  let streak = 0;
  let expectedDate = new Date(today);
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.createdAt).toDateString();
    if (entryDate === expectedDate.toDateString()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (new Date(entry.createdAt) < expectedDate) {
      break;
    }
  }
  
  return streak;
};
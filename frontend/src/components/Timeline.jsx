import React from 'react';
import DiaryCard from './DiaryCard';

const Timeline = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-textMuted">
        <p>Your diary is empty.</p>
        <p className="text-sm mt-1">Start logging your vibes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-vibePink before:to-transparent">
      {entries.map((entry, index) => (
        <DiaryCard key={entry._id || index} entry={entry} />
      ))}
    </div>
  );
};

export default Timeline;

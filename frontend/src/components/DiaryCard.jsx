import React from 'react';

const DiaryCard = ({ entry }) => {
  const isImage = entry.type === 'image';
  const hasPalette = entry.color_palette && entry.color_palette.length > 0;
  
  // Construct gradient from palette if available
  const bgStyle = hasPalette ? {
    background: `linear-gradient(135deg, ${entry.color_palette[0]}22, ${entry.color_palette[1] || entry.color_palette[0]}22)`
  } : {
    background: 'white' // default white card
  };

  const formattedDate = entry.timestamp 
    ? new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Just now';

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      {/* Timeline dot */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-vibePink bg-vibeWhite text-accentPink shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
        <div className="w-2 h-2 rounded-full bg-accentOrange" />
      </div>

      {/* Card content */}
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl shadow-sm border border-vibePink/50 transition-all hover:shadow-md" style={bgStyle}>
        <div className="mb-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
          {formattedDate}
        </div>
        
        {isImage ? (
          <div className="space-y-3">
            <img src={entry.content} alt="Photo dump" className="rounded-xl w-full object-cover max-h-64 shadow-sm" />
            <div className="flex flex-col gap-1">
              <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-textDark w-max border border-white/40">
                {entry.aesthetic_tag || 'Visual Vibe'}
              </span>
              <p className="text-sm text-textDark/80 italic">"{entry.caption}"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-textDark text-lg leading-relaxed">{entry.content}</p>
            <div className="flex flex-col gap-1 pt-3 border-t border-black/5">
              <span className="inline-block px-3 py-1 bg-accentPink/10 text-accentPink rounded-full text-xs font-semibold w-max">
                {entry.emotion_tag || 'Thought'}
              </span>
              <p className="text-sm text-textMuted font-medium">{entry.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryCard;

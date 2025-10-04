'use client';

import type { MoodSelection } from '@/types';

interface MoodCardProps {
  mood: string;
  users: MoodSelection[];
  onClick: () => void;
}

export const MoodCard = ({ mood, users, onClick }: MoodCardProps) => {
  // Generate background style based on number of users
  const getBackgroundStyle = (): React.CSSProperties => {
    if (users.length === 0) {
      return {};
    }

    if (users.length === 1) {
      return { backgroundColor: users[0].user_color };
    }

    // Multiple users - create vertical stripes
    const percentage = 100 / users.length;
    const gradientStops = users
      .map((user, index) => {
        const start = index * percentage;
        const end = (index + 1) * percentage;
        return `${user.user_color} ${start}% ${end}%`;
      })
      .join(', ');

    return {
      background: `linear-gradient(to right, ${gradientStops})`,
    };
  };

  const isSelected = users.length > 0;

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full h-full
        flex items-center justify-center text-center
        font-medium text-[0.55rem] sm:text-[0.65rem]
        rounded-sm sm:rounded-md
        transition-all duration-150
        ${isSelected 
          ? 'shadow-md hover:shadow-lg hover:scale-[1.02] text-gray-900 font-semibold border-2 border-gray-900/20' 
          : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md hover:scale-[1.02] text-gray-700 border border-gray-300/50'
        }
      `}
      style={getBackgroundStyle()}
    >
      <span className="px-0.5 sm:px-1 py-0.5 leading-tight">
        {mood}
      </span>
    </button>
  );
};


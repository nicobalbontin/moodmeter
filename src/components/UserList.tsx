'use client';

import type { MoodSelection } from '@/types';

interface UserListProps {
  moodSelections: MoodSelection[];
}

export const UserList = ({ moodSelections }: UserListProps) => {
  // Get unique users by session_id
  const uniqueUsers = Array.from(
    new Map(
      moodSelections.map((selection) => [selection.session_id, selection])
    ).values()
  );

  if (uniqueUsers.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 py-2 px-3">
        <p className="text-center text-gray-500 text-[0.65rem] sm:text-xs font-medium">
          🎭 Click on a mood to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 py-2 px-3">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center text-[0.55rem] sm:text-[0.65rem] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
          Team ({uniqueUsers.length})
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center">
          {uniqueUsers.map((user) => (
            <div 
              key={user.session_id} 
              className="flex items-center gap-1.5 bg-white rounded-full pl-0.5 pr-2 py-0.5 shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <div
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-md flex-shrink-0"
                style={{ backgroundColor: user.user_color }}
              />
              <div className="flex flex-col">
                <span className="font-semibold text-[0.65rem] sm:text-xs text-gray-900">{user.user_name}</span>
                <span className="text-[0.55rem] sm:text-[0.65rem] text-gray-600">Feeling {user.selected_mood.toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


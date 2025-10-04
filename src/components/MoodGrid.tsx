'use client';

import { MoodCard } from './MoodCard';
import { MOOD_GRID, getQuadrantColor } from '@/lib/constants';
import type { MoodSelection } from '@/types';

interface MoodGridProps {
  moodSelections: MoodSelection[];
  onMoodClick: (mood: string) => void;
}

export const MoodGrid = ({ moodSelections, onMoodClick }: MoodGridProps) => {
  // Group selections by mood
  const moodMap = new Map<string, MoodSelection[]>();
  moodSelections.forEach((selection) => {
    const existing = moodMap.get(selection.selected_mood) || [];
    moodMap.set(selection.selected_mood, [...existing, selection]);
  });

  return (
    <div className="w-full h-full flex items-center justify-center px-8 sm:px-12">
      <div className="relative w-full max-w-[90vw] flex items-center justify-center">
        {/* Left Y-axis label (Energy) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12">
          <div className="flex flex-col items-center gap-1 font-bold text-gray-700">
            <span className="text-base sm:text-lg">↑</span>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
              <span className="text-[0.6rem] sm:text-[0.7rem] tracking-tight">High Energy</span>
            </div>
            <div className="h-8 sm:h-16 w-px bg-gray-400"></div>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
              <span className="text-[0.6rem] sm:text-[0.7rem] tracking-tight">Low Energy</span>
            </div>
            <span className="text-base sm:text-lg">↓</span>
          </div>
        </div>

        {/* Bottom X-axis label (Pleasantness) */}
        <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="flex items-center gap-1 sm:gap-2 font-bold text-gray-700">
            <span className="text-base sm:text-lg">←</span>
            <span className="text-[0.6rem] sm:text-[0.7rem] tracking-tight">LOW PLEASANTNESS</span>
            <div className="w-8 sm:w-16 h-px bg-gray-400"></div>
            <span className="text-[0.6rem] sm:text-[0.7rem] tracking-tight">HIGH PLEASANTNESS</span>
            <span className="text-base sm:text-lg">→</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-10 gap-0.5 sm:gap-1 p-1.5 sm:p-2 bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-xl">
          {MOOD_GRID.map((row, rowIndex) =>
            row.map((mood, colIndex) => {
              const quadrantColor = getQuadrantColor(rowIndex, colIndex);
              const users = moodMap.get(mood) || [];

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${quadrantColor} p-0.5 rounded-sm sm:rounded-md`}
                  style={{ aspectRatio: '5/3' }}
                >
                  <MoodCard
                    mood={mood}
                    users={users}
                    onClick={() => onMoodClick(mood)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


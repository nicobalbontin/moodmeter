'use client';

import { useState, useEffect } from 'react';
import { MoodGrid } from '@/components/MoodGrid';
import { UserList } from '@/components/UserList';
import { UserNameModal } from '@/components/UserNameModal';
import { useMoodData } from '@/hooks/useMoodData';
import { supabase } from '@/lib/supabase';
import { generatePastelColor } from '@/lib/constants';
import type { UserSession, MoodSelection } from '@/types';

const STORAGE_KEY = 'moodmeter-session';

export default function MoodMeterTableFull() {
  const { moodSelections, loading, error } = useMoodData();
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [optimisticSelections, setOptimisticSelections] = useState<MoodSelection[]>([]);

  // Merge real data with optimistic updates
  const displayedSelections = optimisticSelections.length > 0 ? optimisticSelections : moodSelections;

  // Load session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession) as UserSession;
        setUserSession(session);
      } catch (err) {
        console.error('Error parsing stored session:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Clear optimistic updates when real data arrives
  useEffect(() => {
    if (moodSelections.length > 0) {
      setOptimisticSelections([]);
    }
  }, [moodSelections]);

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);

    if (userSession) {
      // User already has a session, update their mood
      updateMood(mood);
    } else {
      // New user, open modal to get name
      setIsModalOpen(true);
    }
  };

  const handleNameSubmit = async (name: string) => {
    const sessionId = crypto.randomUUID();
    const userColor = generatePastelColor();

    const newSession: UserSession = {
      sessionId,
      userName: name,
      userColor,
    };

    // Save session to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setUserSession(newSession);

    // Optimistic update - show immediately
    const optimisticSelection: MoodSelection = {
      id: crypto.randomUUID(),
      user_name: name,
      user_color: userColor,
      selected_mood: selectedMood,
      session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setOptimisticSelections([...moodSelections, optimisticSelection]);

    // Insert into Supabase in background
    try {
      const { error } = await supabase.from('mood_selections').insert({
        user_name: name,
        user_color: userColor,
        selected_mood: selectedMood,
        session_id: sessionId,
      });

      if (error) {
        console.error('Error inserting mood selection:', error);
      }
    } catch (err) {
      console.error('Error saving mood selection:', err);
    }
  };

  const updateMood = async (mood: string) => {
    if (!userSession) return;

    // Optimistic update - update UI immediately
    const updatedSelections = moodSelections.map((selection) =>
      selection.session_id === userSession.sessionId
        ? { ...selection, selected_mood: mood, updated_at: new Date().toISOString() }
        : selection
    );
    setOptimisticSelections(updatedSelections);

    try {
      // Find existing record for this session
      const { data: existing } = await supabase
        .from('mood_selections')
        .select('id')
        .eq('session_id', userSession.sessionId)
        .single();

      if (existing) {
        // Update existing record in background
        const { error } = await supabase
          .from('mood_selections')
          .update({
            selected_mood: mood,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating mood:', error);
          // Revert optimistic update on error
          setOptimisticSelections([]);
        }
      } else {
        // Insert new record (shouldn't happen but handle it)
        const { error } = await supabase.from('mood_selections').insert({
          user_name: userSession.userName,
          user_color: userSession.userColor,
          selected_mood: mood,
          session_id: userSession.sessionId,
        });

        if (error) {
          console.error('Error inserting mood:', error);
          // Revert optimistic update on error
          setOptimisticSelections([]);
        }
      }
    } catch (err) {
      console.error('Error updating mood:', err);
      // Revert optimistic update on error
      setOptimisticSelections([]);
    }
  };

  const handleResetSession = () => {
    if (!userSession) return;

    // Delete from database
    supabase
      .from('mood_selections')
      .delete()
      .eq('session_id', userSession.sessionId)
      .then(({ error }) => {
        if (error) {
          console.error('Error deleting mood selection:', error);
        }
      });

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    setUserSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-pulse flex items-center justify-center text-2xl">
              🎭
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading MoodMeter...</h2>
          <p className="text-gray-600 text-sm">Getting ready to share moods</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <p className="text-gray-600 text-sm mb-6">
            Please make sure the database is set up correctly and real-time is enabled.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                MoodMeter - Table Full
              </h1>
              <p className="text-[0.55rem] sm:text-[0.65rem] text-gray-600 mt-0.5">
                Share your mood in real-time
              </p>
            </div>
            {userSession && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1 bg-white rounded-full pl-0.5 pr-2 py-0.5 shadow-sm">
                  <div
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: userSession.userColor }}
                  />
                  <span className="font-semibold text-[0.65rem] sm:text-xs hidden sm:inline">{userSession.userName}</span>
                </div>
                <button
                  onClick={handleResetSession}
                  className="text-[0.55rem] sm:text-[0.65rem] text-gray-600 hover:text-gray-900 hover:underline transition-all"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-2 sm:py-3">
        <MoodGrid
          moodSelections={displayedSelections}
          onMoodClick={handleMoodClick}
        />
      </main>

      {/* User List at Bottom */}
      <footer className="flex-shrink-0">
        <UserList moodSelections={displayedSelections} />
      </footer>

      {/* Modal for Name Input */}
      <UserNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameSubmit}
        selectedMood={selectedMood}
      />
    </div>
  );
}

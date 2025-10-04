'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { MoodSelection } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useMoodData = () => {
  const [moodSelections, setMoodSelections] = useState<MoodSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchMoodSelections = async () => {
      try {
        const { data, error } = await supabase
          .from('mood_selections')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMoodSelections(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mood selections:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel('mood-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mood_selections',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setMoodSelections((prev) => [...prev, payload.new as MoodSelection]);
            } else if (payload.eventType === 'UPDATE') {
              setMoodSelections((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id ? (payload.new as MoodSelection) : item
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setMoodSelections((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    fetchMoodSelections();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { moodSelections, loading, error };
};


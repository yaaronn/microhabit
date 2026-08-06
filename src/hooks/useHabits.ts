import { useState, useCallback } from 'react';
import { supabase } from '../api/supabase';
import { useHabitStore } from '../store/useHabitStore';
import { usePetStore } from '../store/usePetStore';
import { calculateXpEarned, processXpGain } from '../utils/gamification';
import { Habit } from '../types/habit';

export const useHabits = () => {
  const { habits, setHabits, addHabit, updateHabit, isLoading } = useHabitStore();
  const { pet, setPet } = usePetStore();
  const [fetching, setFetching] = useState(false);

  // Fetch all habits for the logged-in user
  const fetchHabits = useCallback(async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setHabits(data as Habit[]);
    } catch (err) {
      console.error('Error fetching habits:', err);
    } finally {
      setFetching(false);
    }
  }, [setHabits]);

  // Create a new habit
  const createHabit = async (title: string, description?: string, targetDuration: number = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newHabit = {
        user_id: user.id,
        title,
        description: description || '',
        streak_count: 0,
        is_completed_today: false,
        target_duration_minutes: targetDuration,
      };

      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select()
        .single();

      if (error) throw error;
      if (data) addHabit(data as Habit);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error creating habit:', err);
      return { success: false, error: err.message };
    }
  };

  // Complete a habit, create a log, and award XP/coins to pet
  const completeHabit = async (habitId: string, durationMinutes: number) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit || !pet) return;

    const updatedStreak = habit.streak_count + 1;
    const xpGained = calculateXpEarned(durationMinutes, updatedStreak);

    // Optimistic store update for habit
    updateHabit(habitId, {
      is_completed_today: true,
      streak_count: updatedStreak,
    });

    // Calculate pet updates
    const { updatedPet, didLevelUp } = processXpGain(pet, xpGained);
    setPet(updatedPet);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Update habit in Supabase
      await supabase
        .from('habits')
        .update({ streak_count: updatedStreak, is_completed_today: true })
        .eq('id', habitId);

      // 2. Insert habit log
      if (user) {
        await supabase.from('habit_logs').insert([
          {
            habit_id: habitId,
            user_id: user.id,
            completed_at: new Date().toISOString(),
            duration_minutes: durationMinutes,
            xp_earned: xpGained,
          },
        ]);
      }

      // 3. Sync updated pet state to Supabase
      if (user) {
        await supabase
          .from('pet_state')
          .update({
            level: updatedPet.level,
            current_xp: updatedPet.current_xp,
            xp_to_next_level: updatedPet.xp_to_next_level,
            coins: updatedPet.coins,
            stage: updatedPet.stage,
            updated_at: updatedPet.updated_at,
          })
          .eq('user_id', user.id);
      }

      return { success: true, xpGained, didLevelUp };
    } catch (err) {
      console.error('Error recording habit completion:', err);
      return { success: false };
    }
  };

  return {
    habits,
    isLoading: isLoading || fetching,
    fetchHabits,
    createHabit,
    completeHabit,
  };
};
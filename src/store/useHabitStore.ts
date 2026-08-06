import { create } from 'zustand';
import { Habit } from '../types/habit';

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updatedFields: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  markCompleted: (id: string) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  isLoading: false,

  setHabits: (habits) => set({ habits }),
  
  addHabit: (habit) =>
    set((state) => ({ habits: [habit, ...state.habits] })),

  updateHabit: (id, updatedFields) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...updatedFields } : h
      ),
    })),

  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),

  markCompleted: (id) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id
          ? { ...h, is_completed_today: true, streak_count: h.streak_count + 1 }
          : h
      ),
    })),
}));
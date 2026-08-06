import { create } from 'zustand';
import { PetState } from '../types/pet';

interface PetStoreState {
  pet: PetState | null;
  isLoading: boolean;
  setPet: (pet: PetState) => void;
  updatePetState: (updatedFields: Partial<PetState>) => void;
}

export const usePetStore = create<PetStoreState>((set) => ({
  pet: {
    id: 'default-pet',
    user_id: 'local-user',
    name: 'Buddy',
    level: 1,
    current_xp: 0,
    xp_to_next_level: 100,
    coins: 0,
    stage: 'egg',
    health: 100,
    updated_at: new Date().toISOString(),
  },
  isLoading: false,

  setPet: (pet) => set({ pet }),
  
  updatePetState: (updatedFields) =>
    set((state) => ({
      pet: state.pet ? { ...state.pet, ...updatedFields } : null,
    })),
}));
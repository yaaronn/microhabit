import { useState, useCallback } from 'react';
import { supabase } from '../api/supabase';
import { usePetStore } from '../store/usePetStore';
import { PetState } from '../types/pet';

export const usePet = () => {
  const { pet, setPet, updatePetState } = usePetStore();
  const [loading, setLoading] = useState(false);

  // Fetch pet data for current user
  const fetchPet = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pet_state')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error if initial row creation happens on signup

      if (data) {
        setPet(data as PetState);
      }
    } catch (err) {
      console.error('Error fetching pet state:', err);
    } finally {
      setLoading(false);
    }
  }, [setPet]);

  return {
    pet,
    loading,
    fetchPet,
    updatePetState,
  };
};
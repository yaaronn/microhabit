import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useHabits } from '../hooks/useHabits';
import { usePet } from '../hooks/usePets';
import { PetAvatar } from '../components/pet/PetAvatar';
import { HabitCard } from '../components/habits/HabitCard';

export const HomeScreen: React.FC = () => {
  const { habits, isLoading, fetchHabits, createHabit, completeHabit } = useHabits();
  const { pet, fetchPet } = usePet();

  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('10');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchHabits();
    fetchPet();
  }, [fetchHabits, fetchPet]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a habit title.');
      return;
    }
    const duration = parseInt(newDuration, 10) || 10;
    const result = await createHabit(newTitle.trim(), '', duration);
    if (result.success) {
      setNewTitle('');
      setIsAdding(false);
    } else {
      Alert.alert('Error', result.error || 'Failed to create habit');
    }
  };

  const handleComplete = async (habitId: string, duration: number) => {
    const res = await completeHabit(habitId, duration);
    if (res?.didLevelUp) {
      Alert.alert('🎉 LEVEL UP!', `Your pet leveled up to Level ${pet ? pet.level + 1 : ''}!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>MicroHabit 🐾</Text>

        {/* Pet Avatar Dashboard */}
        <PetAvatar pet={pet} />

        {/* Action Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          <TouchableOpacity
            style={styles.addToggleBtn}
            onPress={() => setIsAdding(!isAdding)}
          >
            <Text style={styles.addToggleText}>{isAdding ? 'Cancel' : '+ New Habit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Inline Create Form */}
        {isAdding && (
          <View style={styles.formCard}>
            <TextInput
              style={styles.input}
              placeholder="Habit Title (e.g. Drink Water)"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Target Duration (mins)"
              keyboardType="numeric"
              value={newDuration}
              onChangeText={setNewDuration}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
              <Text style={styles.submitBtnText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Habit List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 20 }} />
        ) : habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits found. Add your first habit above!</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onComplete={handleComplete} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#0F172A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addToggleBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addToggleText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },
});
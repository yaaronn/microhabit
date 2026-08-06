import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../../types/habit';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string, duration: number) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete }) => {
  return (
    <View style={[styles.card, habit.is_completed_today && styles.cardCompleted]}>
      <View style={styles.info}>
        <Text style={[styles.title, habit.is_completed_today && styles.completedText]}>
          {habit.title}
        </Text>
        {habit.description ? (
          <Text style={styles.description}>{habit.description}</Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.streak}>🔥 {habit.streak_count} day streak</Text>
          <Text style={styles.duration}>⏱️ {habit.target_duration_minutes}m</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, habit.is_completed_today && styles.buttonCompleted]}
        disabled={habit.is_completed_today}
        onPress={() => onComplete(habit.id, habit.target_duration_minutes)}
      >
        <Text style={styles.buttonText}>
          {habit.is_completed_today ? '✓ Done' : 'Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardCompleted: {
    backgroundColor: '#F8FAFC',
    opacity: 0.8,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
  },
  streak: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA580C',
  },
  duration: {
    fontSize: 12,
    color: '#64748B',
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonCompleted: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PetState } from '../../types/pet';

interface PetAvatarProps {
  pet: PetState | null;
}

const STAGE_EMOJIS: Record<PetState['stage'], string> = {
  egg: '🥚',
  baby: '🐣',
  teen: '🐥',
  adult: '🦅',
  legendary: '🐉',
};

export const PetAvatar: React.FC<PetAvatarProps> = ({ pet }) => {
  if (!pet) return null;

  const progressPercent = Math.min(
    100,
    Math.round((pet.current_xp / pet.xp_to_next_level) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Pet Visual */}
      <View style={styles.avatarCircle}>
        <Text style={styles.emoji}>{STAGE_EMOJIS[pet.stage] || '🐣'}</Text>
      </View>

      {/* Pet Info */}
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.levelText}>Level {pet.level} • {pet.stage.toUpperCase()}</Text>

      {/* XP Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {pet.current_xp} / {pet.xp_to_next_level} XP ({progressPercent}%)
        </Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Text style={styles.stat}>🪙 {pet.coins} Coins</Text>
        <Text style={styles.stat}>❤️ {pet.health}% HP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 48,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  levelText: {
    fontSize: 14,
    color: '#64748B',
    marginVertical: 2,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
  },
  barBackground: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  xpText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stat: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
});
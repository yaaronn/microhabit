export interface PetState {
  id: string;
  user_id: string;
  name: string;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
  coins: number;
  stage: 'egg' | 'baby' | 'teen' | 'adult' | 'legendary';
  health: number;
  updated_at: string;
}

export interface LevelInfo {
  level: number;
  current_xp: number;
  xp_required: number;
  progress_percentage: number;
}
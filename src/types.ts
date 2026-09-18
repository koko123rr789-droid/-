export interface StudyPlatform {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  description: string;
  category: 'primary' | 'custom';
  color: string;
  iconName: string;
  dailyLimitMinutes: number; // Default 300 minutes (5 hours)
  usedTodaySeconds: number;
  lastOpenedAt?: number;
  isFavorite?: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  subject?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UserProgressState {
  date: string; // YYYY-MM-DD
  platformsUsage: Record<string, number>; // platformId -> seconds used today
  totalStudySecondsToday: number;
  earnedGameSeconds: number;
  usedGameSeconds: number;
  dailyTasks: DailyTask[];
  notes: string;
  streakDays: number;
}

export interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  difficulty: string;
  description: string;
  packageName?: string;
  storeUrl?: string;
}

export type BackgroundMode = 'thanaweya_poster' | 'sunrise_motion' | 'lofi_study' | 'deep_space';

export interface BackgroundSetting {
  mode: BackgroundMode;
  darknessOverlay: number; // 0 to 100
  enableParticles: boolean;
  enableRays: boolean;
  customVideoUrl?: string;
}

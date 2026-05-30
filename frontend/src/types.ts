export interface User {
  id: string;
  provider: 'google' | 'github';
  provider_user_id: string;
  email: string | null;
  display_name: string;
  avatar_url: string | null;
  created_at: number;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  status: 'active' | 'paused' | 'archived';
  created_at: number;
  updated_at: number;
  currentStreak?: number;
  bestStreak?: number;
  totalCheckins?: number;
}

export interface Checkin {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  created_at: number;
}

export interface MilestoneNotification {
  id: string;
  habit_id: string;
  user_id: string;
  milestone_days: 3 | 7 | 30;
  sent_at: number;
}

// WebSocket message types
export type WSMessage =
  | ConnectedMessage
  | MilestoneMessage
  | SubscribeMessage
  | AckMessage;

export interface ConnectedMessage {
  type: 'connected';
  payload: {
    userId: string;
  };
}

export interface MilestoneMessage {
  type: 'milestone';
  payload: {
    habitId: string;
    habitName: string;
    milestoneDays: 3 | 7 | 30;
    currentStreak: number;
  };
}

export interface SubscribeMessage {
  type: 'subscribe';
  payload: {
    milestones: true;
  };
}

export interface AckMessage {
  type: 'ack';
  payload: {
    habitId: string;
    milestoneDays: 3 | 7 | 30;
  };
}

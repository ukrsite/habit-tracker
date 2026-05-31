export interface User {
  id: string;
  provider: 'google' | 'github' | 'demo';
  providerUserId: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  createdAt: number;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: string;
  status: 'active' | 'paused' | 'archived';
  createdAt: number;
  updatedAt: number;
  currentStreak?: number;
  bestStreak?: number;
  totalCheckins?: number;
  completedToday?: boolean;
}

export interface Checkin {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  createdAt: number;
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

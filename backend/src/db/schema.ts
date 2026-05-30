import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    provider: text('provider').notNull(), // 'google' | 'github'
    providerUserId: text('provider_user_id').notNull(),
    email: text('email'),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url'),
    createdAt: integer('created_at').notNull(), // Unix timestamp
  },
  (table) => ({
    uniqueProviderConstraint: unique().on(table.provider, table.providerUserId),
  })
);

// Habits table
export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  startDate: text('start_date').notNull(), // YYYY-MM-DD
  status: text('status', { enum: ['active', 'paused', 'archived'] })
    .notNull()
    .default('active'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Checkins table
export const checkins = sqliteTable(
  'checkins',
  {
    id: text('id').primaryKey(),
    habitId: text('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    date: text('date').notNull(), // YYYY-MM-DD
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    uniqueDateConstraint: unique().on(table.habitId, table.date),
  })
);

// Milestone notifications table
export const milestoneNotifications = sqliteTable(
  'milestone_notifications',
  {
    id: text('id').primaryKey(),
    habitId: text('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    milestoneDays: integer('milestone_days').notNull(), // 3 | 7 | 30
    sentAt: integer('sent_at').notNull(),
  },
  (table) => ({
    uniqueMilestoneConstraint: unique().on(table.habitId, table.milestoneDays),
  })
);

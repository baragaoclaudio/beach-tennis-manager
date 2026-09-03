import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('Role', ['ADMIN', 'PROFESSOR']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull()
}, (table) => [
  uniqueIndex('users_email_key').on(table.email)
]);

export const professors = pgTable('professors', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  name: text('name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull()
}, (table) => [
  uniqueIndex('professors_user_id_key').on(table.userId)
]);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { precision: 3, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow()
}, (table) => [
  uniqueIndex('sessions_token_hash_key').on(table.tokenHash),
  index('sessions_user_id_idx').on(table.userId)
]);

export const usersRelations = relations(users, ({ one, many }) => ({
  professor: one(professors),
  sessions: many(sessions)
}));

export const professorsRelations = relations(professors, ({ one }) => ({
  user: one(users, {
    fields: [professors.userId],
    references: [users.id]
  })
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));
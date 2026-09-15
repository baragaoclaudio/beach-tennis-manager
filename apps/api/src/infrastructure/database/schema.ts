import { relations } from 'drizzle-orm';
import {
  type AnyPgColumn,
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

export const refreshTokens = pgTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { precision: 3, mode: 'date' }).notNull(),
  familyId: text('family_id').notNull(),
  replacedById: text('replaced_by_id').references((): AnyPgColumn => refreshTokens.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  revokedAt: timestamp('revoked_at', { precision: 3, mode: 'date' }),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow()
}, (table) => [
  uniqueIndex('refresh_tokens_token_hash_key').on(table.tokenHash),
  index('refresh_tokens_user_id_idx').on(table.userId),
  index('refresh_tokens_family_id_idx').on(table.familyId)
]);

export const usersRelations = relations(users, ({ one, many }) => ({
  professor: one(professors),
  refreshTokens: many(refreshTokens)
}));

export const professorsRelations = relations(professors, ({ one }) => ({
  user: one(users, {
    fields: [professors.userId],
    references: [users.id]
  })
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id]
  }),
  replacedBy: one(refreshTokens, {
    fields: [refreshTokens.replacedById],
    references: [refreshTokens.id]
  })
}));

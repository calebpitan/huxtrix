import { pgTable, serial, text, bigint, varchar, timestamp, uniqueIndex, foreignKey, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const drizzleMigrations = pgTable("__drizzle_migrations", {
	id: serial().primaryKey().notNull(),
	hash: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
});

export const verificationTokens = pgTable("verification_tokens", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	identifier: varchar().notNull(),
	token: varchar().notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const users = pgTable("users", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: timestamp("email_verified", { withTimezone: true, mode: 'string' }),
	familyName: varchar("family_name", { length: 255 }).notNull(),
	givenName: varchar("given_name", { length: 255 }).notNull(),
	image: varchar(),
	name: varchar({ length: 128 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("uq_users_email").using("btree", sql`lower((email)::text)`).where(sql`(deleted_at IS NULL)`),
	uniqueIndex("uq_users_name").using("btree", sql`lower((name)::text)`).where(sql`(deleted_at IS NULL)`),
]);

export const accounts = pgTable("accounts", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	provider: varchar().notNull(),
	providerAccountId: varchar("provider_account_id").notNull(),
	type: varchar().notNull(),
	userId: varchar("user_id", { length: 26 }).notNull(),
	accessToken: varchar("access_token", { length: 512 }),
	expiresAt: integer("expires_at"),
	idToken: varchar("id_token"),
	scope: varchar(),
	sessionState: varchar("session_state"),
	refreshToken: varchar("refresh_token"),
	tokenType: varchar("token_type"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_accounts_user_id_users"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	userId: varchar("user_id", { length: 26 }).notNull(),
	sessionToken: varchar("session_token").primaryKey().notNull(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_sessions_expires").using("btree", table.expires.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_sessions_user_id_users"
		}).onDelete("cascade"),
]);

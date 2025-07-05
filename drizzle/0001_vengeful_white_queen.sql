ALTER TABLE "accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider_account_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "access_token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id_token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "scope" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "session_state" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "refresh_token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "token_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "session_token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "family_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "family_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "given_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "given_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text;
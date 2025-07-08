DROP INDEX "uq_users_name";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_username" ON "users" USING btree (LOWER("username")) WHERE "users"."username" IS NOT NULL AND "users"."deleted_at" IS NULL;
CREATE TABLE "accounts" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"provider" varchar NOT NULL,
	"provider_account_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"access_token" varchar(512),
	"expires_at" integer,
	"id_token" varchar,
	"scope" varchar,
	"session_state" varchar,
	"refresh_token" varchar,
	"token_type" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"user_id" varchar(26) NOT NULL,
	"session_token" varchar PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"family_name" varchar(255) NOT NULL,
	"given_name" varchar(255) NOT NULL,
	"image" varchar,
	"name" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"identifier" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "fk_accounts_user_id_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_user_id_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_sessions_expires" ON "sessions" USING btree ("expires");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_email" ON "users" USING btree (LOWER("email")) WHERE "users"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_name" ON "users" USING btree (LOWER("name")) WHERE "users"."deleted_at" IS NULL;
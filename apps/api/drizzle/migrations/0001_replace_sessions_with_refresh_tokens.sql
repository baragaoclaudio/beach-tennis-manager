ALTER TABLE "sessions" RENAME TO "refresh_tokens";--> statement-breakpoint
ALTER TABLE "refresh_tokens" RENAME CONSTRAINT "sessions_user_id_users_id_fk" TO "refresh_tokens_user_id_users_id_fk";--> statement-breakpoint
ALTER INDEX "sessions_token_hash_key" RENAME TO "refresh_tokens_token_hash_key";--> statement-breakpoint
ALTER INDEX "sessions_user_id_idx" RENAME TO "refresh_tokens_user_id_idx";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "family_id" text;--> statement-breakpoint
UPDATE "refresh_tokens" SET "family_id" = "id";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "family_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "replaced_by_id" text;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "revoked_at" timestamp (3);--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_replaced_by_id_refresh_tokens_id_fk" FOREIGN KEY ("replaced_by_id") REFERENCES "public"."refresh_tokens"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens" USING btree ("family_id");

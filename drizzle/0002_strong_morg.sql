ALTER TABLE "marketplace_order" ADD COLUMN "brief" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "platform_fee_bps" integer DEFAULT 1200 NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "delivery_days" integer DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "revisions_allowed" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "revision_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "deliverable_url" text;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "stripe_checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "stripe_payment_intent_id" text;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "stripe_charge_id" text;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "stripe_transfer_id" text;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "accept_by" timestamp;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "delivery_due_at" timestamp;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "review_due_at" timestamp;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "delivered_at" timestamp;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "member_profile" ADD COLUMN "stripe_account_id" text;--> statement-breakpoint
ALTER TABLE "member_profile" ADD COLUMN "stripe_transfers_status" text;--> statement-breakpoint
ALTER TABLE "member_profile" ADD CONSTRAINT "member_profile_stripe_account_id_unique" UNIQUE("stripe_account_id");--> statement-breakpoint
UPDATE "marketplace_order" SET "status" = 'awaiting_acceptance' WHERE "status" = 'paid';
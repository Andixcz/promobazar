ALTER TABLE "member_profile" ADD COLUMN "billing_plan" text;--> statement-breakpoint
ALTER TABLE "member_profile" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "member_profile" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "member_profile" ADD COLUMN "subscription_status" text;
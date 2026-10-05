CREATE TABLE "marketplace_order" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_user_id" text NOT NULL,
	"client_user_id" text NOT NULL,
	"title" text NOT NULL,
	"amount_czk" integer NOT NULL,
	"status" text DEFAULT 'pending_payment' NOT NULL,
	"package_id" text,
	"job_post_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD CONSTRAINT "marketplace_order_creator_user_id_member_profile_user_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."member_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD CONSTRAINT "marketplace_order_client_user_id_member_profile_user_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."member_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD CONSTRAINT "marketplace_order_package_id_creator_package_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."creator_package"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_order" ADD CONSTRAINT "marketplace_order_job_post_id_brand_job_post_id_fk" FOREIGN KEY ("job_post_id") REFERENCES "public"."brand_job_post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "marketplace_order_creator_idx" ON "marketplace_order" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX "marketplace_order_client_idx" ON "marketplace_order" USING btree ("client_user_id");--> statement-breakpoint
CREATE INDEX "marketplace_order_status_idx" ON "marketplace_order" USING btree ("status");
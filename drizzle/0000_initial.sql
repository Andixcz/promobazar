CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_job_post" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"budget_czk" integer NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_package" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"format" text NOT NULL,
	"delivery_days" integer DEFAULT 7 NOT NULL,
	"revisions" integer DEFAULT 1 NOT NULL,
	"license_days" text DEFAULT '30' NOT NULL,
	"price_czk" integer NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_platform_link" (
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"platform_user_id" text NOT NULL,
	"username" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"connected_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "creator_platform_link_user_id_platform_pk" PRIMARY KEY("user_id","platform")
);
--> statement-breakpoint
CREATE TABLE "member_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"role" text NOT NULL,
	"display_name" text,
	"bio" text,
	"category" text DEFAULT 'fitness',
	"avatar_url" text,
	"banner_url" text,
	"social_tiktok" text,
	"social_instagram" text,
	"social_youtube" text,
	"portfolio_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"profile_views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "member_profile_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_job_post" ADD CONSTRAINT "brand_job_post_user_id_member_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."member_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_package" ADD CONSTRAINT "creator_package_user_id_member_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."member_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_platform_link" ADD CONSTRAINT "creator_platform_link_user_id_member_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."member_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_profile" ADD CONSTRAINT "member_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "brand_job_post_user_idx" ON "brand_job_post" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "creator_package_user_idx" ON "creator_package" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "creator_platform_link_user_idx" ON "creator_platform_link" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_profile_slug_idx" ON "member_profile" USING btree ("slug");
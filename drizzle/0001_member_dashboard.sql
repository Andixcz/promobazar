CREATE TABLE IF NOT EXISTS "member_profile" (
  "user_id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
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
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "member_profile_slug_idx" ON "member_profile" ("slug");

ALTER TABLE "member_profile"
  ADD CONSTRAINT "member_profile_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;

CREATE TABLE IF NOT EXISTS "creator_package" (
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

CREATE INDEX IF NOT EXISTS "creator_package_user_idx" ON "creator_package" ("user_id");

ALTER TABLE "creator_package"
  ADD CONSTRAINT "creator_package_user_id_member_profile_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "member_profile"("user_id") ON DELETE cascade ON UPDATE no action;

CREATE TABLE IF NOT EXISTS "brand_job_post" (
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

CREATE INDEX IF NOT EXISTS "brand_job_post_user_idx" ON "brand_job_post" ("user_id");

ALTER TABLE "brand_job_post"
  ADD CONSTRAINT "brand_job_post_user_id_member_profile_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "member_profile"("user_id") ON DELETE cascade ON UPDATE no action;

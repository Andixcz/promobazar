ALTER TABLE "creator_package" ADD COLUMN "showcase_urls" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "creator_package" ADD COLUMN "banner_url" text;
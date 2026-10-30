ALTER TABLE "creator_package" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
UPDATE "creator_package" SET "status" = 'published';
ALTER TABLE "marketplace_order" ADD COLUMN "brief_attachments" jsonb DEFAULT '[]'::jsonb NOT NULL;

-- Migration to add missing columns to 'shops' table

ALTER TABLE shops 
ADD COLUMN IF NOT EXISTS whatsapp_number text,
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS banner_url text,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS business_hours jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS products jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS services jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS testimonials jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS custom_links jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS social_embeds jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS stats_clients text,
ADD COLUMN IF NOT EXISTS stats_photos text,
ADD COLUMN IF NOT EXISTS stats_rating text,
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS template text DEFAULT 'modern',
ADD COLUMN IF NOT EXISTS custom_css text,
ADD COLUMN IF NOT EXISTS custom_js text,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS trial_extended boolean DEFAULT false;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug);

-- Create storage bucket for shop media (100MB limit per user handled in app)
INSERT INTO storage.buckets (id, name, public) VALUES ('shop-media', 'shop-media', true);

-- Create policies for shop media storage
CREATE POLICY "Users can upload their own shop media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'shop-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own shop media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'shop-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own shop media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'shop-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view shop media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'shop-media');

-- Add new columns to shops table
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS products jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS featured_video text DEFAULT '',
ADD COLUMN IF NOT EXISTS stats jsonb DEFAULT '{"clients": "0", "photos": "0", "rating": "0"}'::jsonb;
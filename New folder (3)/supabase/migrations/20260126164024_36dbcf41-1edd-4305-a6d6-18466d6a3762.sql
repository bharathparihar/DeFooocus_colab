-- Add custom CSS/JS and social embeds to shops table
ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS custom_css TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS custom_js TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS social_embeds JSONB DEFAULT '[]'::jsonb;

-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  service TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies for inquiries - shop owners can manage, anyone can insert
CREATE POLICY "Anyone can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Shop owners can view their inquiries" ON public.inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shops WHERE shops.id = inquiries.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Shop owners can update their inquiries" ON public.inquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.shops WHERE shops.id = inquiries.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Shop owners can delete their inquiries" ON public.inquiries FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.shops WHERE shops.id = inquiries.shop_id AND shops.user_id = auth.uid())
);

-- RLS policies for appointments - shop owners can manage, anyone can insert
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Shop owners can view their appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shops WHERE shops.id = appointments.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Shop owners can update their appointments" ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.shops WHERE shops.id = appointments.shop_id AND shops.user_id = auth.uid())
);
CREATE POLICY "Shop owners can delete their appointments" ON public.appointments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.shops WHERE shops.id = appointments.shop_id AND shops.user_id = auth.uid())
);

-- Update triggers
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
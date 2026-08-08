ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS logo_ring boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS premium_label text NOT NULL DEFAULT 'Premium',
  ADD COLUMN IF NOT EXISTS platinum_label text NOT NULL DEFAULT 'Platinum',
  ADD COLUMN IF NOT EXISTS free_features text[] NOT NULL DEFAULT ARRAY['Simple image generation','Upload only 5 images per chat','Standard speed'],
  ADD COLUMN IF NOT EXISTS premium_features text[] NOT NULL DEFAULT ARRAY['Upload 20 images at once','Video upload','PDF & document upload','Unlimited chats','Premium image generation'],
  ADD COLUMN IF NOT EXISTS platinum_features text[] NOT NULL DEFAULT ARRAY['Upload 40 images at once','Video upload','PDF & document upload','Unlimited chats','Extra premium image generation'];
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = {
  ai_name: string;
  logo_url: string | null;
  premium_price: number;
  platinum_price: number;
  currency: string;
  logo_ring: boolean;
  premium_label: string;
  platinum_label: string;
  free_features: string[];
  premium_features: string[];
  platinum_features: string[];
};

export const DEFAULT_SETTINGS: AppSettings = {
  ai_name: "X COPPER",
  logo_url: null,
  premium_price: 199,
  platinum_price: 499,
  currency: "\u20b9",
  logo_ring: true,
  premium_label: "Premium",
  platinum_label: "Platinum",
  free_features: ["Simple image generation", "Upload only 5 images per chat", "Standard speed"],
  premium_features: ["Upload 20 images at once", "Video upload", "PDF & document upload", "Unlimited chats", "Premium image generation"],
  platinum_features: ["Upload 40 images at once", "Video upload", "PDF & document upload", "Unlimited chats", "Extra premium image generation"],
};

let current: AppSettings = DEFAULT_SETTINGS;
const listeners = new Set<(s: AppSettings) => void>();
let started = false;

function apply(row: any) {
  const list = (v: any, fb: string[]) => (Array.isArray(v) && v.length ? v.map(String) : fb);
  current = {
    ai_name: row?.ai_name || DEFAULT_SETTINGS.ai_name,
    logo_url: row?.logo_url ?? null,
    premium_price: Number(row?.premium_price ?? DEFAULT_SETTINGS.premium_price),
    platinum_price: Number(row?.platinum_price ?? DEFAULT_SETTINGS.platinum_price),
    currency: row?.currency || DEFAULT_SETTINGS.currency,
    logo_ring: row?.logo_ring ?? DEFAULT_SETTINGS.logo_ring,
    premium_label: row?.premium_label || DEFAULT_SETTINGS.premium_label,
    platinum_label: row?.platinum_label || DEFAULT_SETTINGS.platinum_label,
    free_features: list(row?.free_features, DEFAULT_SETTINGS.free_features),
    premium_features: list(row?.premium_features, DEFAULT_SETTINGS.premium_features),
    platinum_features: list(row?.platinum_features, DEFAULT_SETTINGS.platinum_features),
  };
  listeners.forEach((l) => l(current));
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const db = supabase as any;
  db.from("app_settings").select("*").eq("id", 1).maybeSingle()
    .then(({ data }: any) => { if (data) apply(data); });
  db.channel("app_settings_rt")
    .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, (p: any) => {
      if (p.new) apply(p.new);
    })
    .subscribe();
}

export function useAppSettings(): AppSettings {
  const [s, setS] = useState<AppSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    start();
    listeners.add(setS);
    setS(current);
    return () => { listeners.delete(setS); };
  }, []);
  return s;
}

export type Tier = "free" | "premium" | "platinum";

export const TIER_LIMITS: Record<Tier, { images: number; docs: boolean; video: boolean; imageGen: string }> = {
  free: { images: 5, docs: false, video: false, imageGen: "Simple image generation" },
  premium: { images: 20, docs: true, video: true, imageGen: "Premium image generation" },
  platinum: { images: 40, docs: true, video: true, imageGen: "Extra premium image generation" },
};

export function effectiveTier(tier?: string | null, expiresAt?: string | null): Tier {
  const t = (tier as Tier) || "free";
  if (t === "free") return "free";
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return "free";
  return t === "platinum" ? "platinum" : "premium";
}

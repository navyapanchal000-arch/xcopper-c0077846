import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = {
  ai_name: string;
  logo_url: string | null;
  premium_price: number;
  platinum_price: number;
  currency: string;
};

export const DEFAULT_SETTINGS: AppSettings = {
  ai_name: "X COPPER",
  logo_url: null,
  premium_price: 199,
  platinum_price: 499,
  currency: "\u20b9",
};

let current: AppSettings = DEFAULT_SETTINGS;
const listeners = new Set<(s: AppSettings) => void>();
let started = false;

function apply(row: any) {
  current = {
    ai_name: row?.ai_name || DEFAULT_SETTINGS.ai_name,
    logo_url: row?.logo_url ?? null,
    premium_price: Number(row?.premium_price ?? DEFAULT_SETTINGS.premium_price),
    platinum_price: Number(row?.platinum_price ?? DEFAULT_SETTINGS.platinum_price),
    currency: row?.currency || DEFAULT_SETTINGS.currency,
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

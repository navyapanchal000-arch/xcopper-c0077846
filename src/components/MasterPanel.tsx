import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Gem, RefreshCw, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { showAlert } from "@/components/AlertPopup";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings, DEFAULT_SETTINGS, effectiveTier } from "@/lib/appSettings";

const db = () => supabase as any;

type Row = {
  id: string;
  email: string | null;
  display_name: string | null;
  tier: string | null;
  tier_expires_at: string | null;
  created_at: string;
};

type ChatRow = { id: string; title: string; messages: any; updated_at: string };

function MasterBody({ open }: { open: boolean }) {
  const settings = useAppSettings();
  const [users, setUsers] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [months, setMonths] = useState("1");
  const [visits, setVisits] = useState<any[]>([]);
  const [name, setName] = useState(settings.ai_name);
  const [logo, setLogo] = useState(settings.logo_url || "");
  const [premium, setPremium] = useState(String(settings.premium_price));
  const [platinum, setPlatinum] = useState(String(settings.platinum_price));

  useEffect(() => {
    setName(settings.ai_name);
    setLogo(settings.logo_url || "");
    setPremium(String(settings.premium_price));
    setPlatinum(String(settings.platinum_price));
  }, [settings]);

  const loadUsers = useCallback(async () => {
    const { data, error } = await db()
      .from("profiles")
      .select("id,email,display_name,tier,tier_expires_at,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) { showAlert(error.message); return; }
    setUsers(data || []);
  }, []);

  const loadVisits = useCallback(async () => {
    const { data } = await db().from("visits").select("*").order("created_at", { ascending: false }).limit(200);
    setVisits(data || []);
  }, []);

  useEffect(() => { if (open) { loadUsers(); loadVisits(); } }, [open, loadUsers, loadVisits]);

  useEffect(() => {
    if (!open) return;
    const ch = db()
      .channel("master_profiles_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => loadUsers())
      .subscribe();
    return () => { db().removeChannel(ch); };
  }, [open, loadUsers]);

  const openUser = async (u: Row) => {
    setSelected(u);
    const { data } = await db()
      .from("chats").select("id,title,messages,updated_at")
      .eq("user_id", u.id).order("updated_at", { ascending: false }).limit(100);
    setChats(data || []);
  };

  const setTier = async (u: Row, tier: "free" | "premium" | "platinum") => {
    const m = Math.max(0, parseInt(months || "1", 10) || 1);
    const expires = tier === "free" ? null : new Date(Date.now() + m * 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await db().from("profiles").update({ tier, tier_expires_at: expires }).eq("id", u.id);
    if (error) { showAlert(error.message); return; }
    showAlert(`${u.email} is now ${tier.toUpperCase()}`);
    loadUsers();
    setSelected({ ...u, tier, tier_expires_at: expires });
  };

  const saveSettings = async () => {
    const { error } = await db().from("app_settings").update({
      ai_name: name || DEFAULT_SETTINGS.ai_name,
      logo_url: logo.trim() || null,
      premium_price: Number(premium) || 0,
      platinum_price: Number(platinum) || 0,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    if (error) { showAlert(error.message); return; }
    showAlert("Saved — live for every user");
  };

  const filtered = users.filter((u) =>
    !query.trim() ||
    (u.email || "").toLowerCase().includes(query.toLowerCase()) ||
    (u.display_name || "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users"><Users className="h-3.5 w-3.5 mr-1" />Manage users</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="visits">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="pt-4 space-y-3">
            {!selected ? (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="Search user by email or name" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={loadUsers}><RefreshCw className="h-4 w-4" /></Button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border rounded-md border border-border">
                  {filtered.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No users found.</p>}
                  {filtered.map((u) => {
                    const t = effectiveTier(u.tier, u.tier_expires_at);
                    return (
                      <button key={u.id} onClick={() => openUser(u)} className="w-full text-left px-3 py-2 hover:bg-accent flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{u.email}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{u.display_name}</p>
                        </div>
                        <TierBadge tier={t} />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>← Back to users</Button>
                <div className="rounded-md border border-border p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selected.email}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {selected.tier_expires_at ? `Expires ${new Date(selected.tier_expires_at).toLocaleDateString()}` : "No expiry"}
                      </p>
                    </div>
                    <TierBadge tier={effectiveTier(selected.tier, selected.tier_expires_at)} />
                  </div>
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="text-[11px] text-muted-foreground">Months</label>
                      <Input className="w-20" value={months} onChange={(e) => setMonths(e.target.value)} />
                    </div>
                    <Button size="sm" onClick={() => setTier(selected, "premium")}><Crown className="h-3.5 w-3.5 mr-1" />Premium</Button>
                    <Button size="sm" onClick={() => setTier(selected, "platinum")}><Gem className="h-3.5 w-3.5 mr-1" />Platinum</Button>
                    <Button size="sm" variant="outline" onClick={() => setTier(selected, "free")}>Free</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Chat history ({chats.length})</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {chats.length === 0 && <p className="text-sm text-muted-foreground text-center py-3">No chats.</p>}
                  {chats.map((c) => (
                    <details key={c.id} className="rounded-md border border-border p-2">
                      <summary className="text-sm cursor-pointer truncate">{c.title}</summary>
                      <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                        {(Array.isArray(c.messages) ? c.messages : []).map((m: any, i: number) => (
                          <p key={i} className="text-[11px]">
                            <b className={m.role === "user" ? "" : "text-primary"}>{m.role}:</b>{" "}
                            <span className="text-muted-foreground">{String(m.content || "").slice(0, 400)}</span>
                          </p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="branding" className="pt-4 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">AI name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Logo image URL</label>
              <Input placeholder="https://... (leave empty for default logo)" value={logo} onChange={(e) => setLogo(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Premium price</label>
                <Input value={premium} onChange={(e) => setPremium(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Platinum price</label>
                <Input value={platinum} onChange={(e) => setPlatinum(e.target.value)} />
              </div>
            </div>
            <Button className="w-full" onClick={saveSettings}>Save changes</Button>
          </TabsContent>

          <TabsContent value="visits" className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Recent visits ({visits.length})</p>
              <Button size="sm" variant="ghost" onClick={loadVisits}><RefreshCw className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border rounded-md border border-border">
              {visits.map((v) => (
                <div key={v.id} className="px-3 py-2 flex items-center gap-2">
                  <span className="text-sm flex-1 truncate">{v.email || "Guest"}</span>
                  <span className="text-[11px] text-muted-foreground">{new Date(v.created_at).toLocaleString()}</span>
                </div>
              ))}
              {visits.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No visits yet.</p>}
            </div>
          </TabsContent>
    </Tabs>
  );
}

export function MasterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Master control
          </DialogTitle>
          <DialogDescription>Manage users, plans, branding and pricing in real time.</DialogDescription>
        </DialogHeader>
        <MasterBody open={open} />
      </DialogContent>
    </Dialog>
  );
}

/** Full-screen master console — no chat, no AI, admin only. */
export function MasterConsole({ email, onSignOut }: { email?: string | null; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 h-14">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <span className="font-semibold text-transparent bg-clip-text whitespace-nowrap" style={{ backgroundImage: "var(--gradient-copper)" }}>
            Master console
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground truncate max-w-[140px]">{email}</span>
          <Button size="sm" variant="outline" onClick={onSignOut}>Sign out</Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl p-4">
        <MasterBody open />
      </main>
    </div>
  );
}

export function TierBadge({ tier }: { tier: "free" | "premium" | "platinum" }) {
  if (tier === "free") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        <Sparkles className="h-3 w-3" /> Free
      </span>
    );
  }
  const Icon = tier === "platinum" ? Gem : Crown;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full text-background font-semibold uppercase tracking-wider"
      style={{ background: "var(--gradient-copper)" }}
    >
      <Icon className="h-3 w-3" /> {tier}
    </span>
  );
}

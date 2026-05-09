import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Plus, Mic, Globe, Paperclip, Image as ImageIcon, Send,
  MessageSquare, Settings, MoreVertical, Radio, X, Square, Camera, FileUp, Video, VideoOff,
  History, LogIn, LogOut, RefreshCw, Trash2, User as UserIcon, Check, Search, Eye, EyeOff,
  Volume2, VolumeX, Wand2, Code2, GraduationCap, PenLine, Languages, Lightbulb, Sigma, Sparkles, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "sonner";
import { XLogo } from "@/components/XLogo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import type { User } from "@supabase/supabase-js";

type Msg = { role: "user" | "assistant"; content: string; attachments?: { name: string; type: string; url?: string }[] };
type Chat = { id: string; title: string; messages: Msg[] };
type VoiceMode = "female" | "male";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const LANGUAGES = [
  "English","Hindi","Spanish","French","German","Japanese","Arabic",
  "Chinese","Portuguese","Russian","Italian","Korean","Bengali","Turkish","Dutch","Urdu","Tamil",
];

const PLACEHOLDERS = [
  "Ask X COPPER",
  "MADE BY NAVYA PANCHAL",
  "Ask anything...",
  "What's on your mind?",
  "Try X COPPER Live",
];

function uid() { return crypto.randomUUID(); }

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([{ id: uid(), title: "New chat", messages: [] }]);
  const [activeId, setActiveId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: string; data: string }[]>([]);
  const [showCredits, setShowCredits] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [language, setLanguage] = useState("English");
  const [liveOpen, setLiveOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<string>("general");
  const [selectedAI, setSelectedAI] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("xcopper_ai") || "xcopper";
  });
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(() => {
    if (typeof window === "undefined") return "female";
    return (localStorage.getItem("xcopper_voice_mode") as VoiceMode) || "female";
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("xcopper_voice_mode", voiceMode);
  }, [voiceMode]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("xcopper_ai", selectedAI);
  }, [selectedAI]);

  const MODES: { id: string; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: Sparkles },
    { id: "photo", label: "Photo edit", icon: Wand2 },
    { id: "coding", label: "Coding", icon: Code2 },
    { id: "study", label: "Study", icon: GraduationCap },
    { id: "writing", label: "Writing", icon: PenLine },
    { id: "translate", label: "Translate", icon: Languages },
    { id: "brainstorm", label: "Brainstorm", icon: Lightbulb },
    { id: "math", label: "Math", icon: Sigma },
  ];

  const AI_OPTIONS: { id: string; label: string }[] = [
    { id: "xcopper", label: "X COPPER" },
    { id: "chatgpt", label: "ChatGPT" },
    { id: "gemini", label: "Gemini" },
    { id: "claude", label: "Claude AI" },
    { id: "perplexity", label: "Perplexity AI" },
    { id: "grok", label: "Grok AI" },
  ];

  const selectedVoiceURI = pickVoice(voices, voiceMode)?.voiceURI || "";

  const speak = (idx: number, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Speech not supported in this browser");
      return;
    }
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*_`#>~\-]/g, ""));
    u.rate = 1;
    u.pitch = 1;
    const v = window.speechSynthesis.getVoices().find(x => x.voiceURI === selectedVoiceURI);
    if (v) u.voice = v;
    u.onend = () => setSpeakingIdx(null);
    u.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const saveTimer = useRef<any>(null);

  const active = chats.find(c => c.id === activeId)!;

  // Auth state
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load history when logged in
  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chats").select("id,title,messages")
      .order("updated_at", { ascending: false }).limit(50);
    if (error) { console.error(error); return; }
    if (data && data.length > 0) {
      setChats(data.map((d: any) => ({ id: d.id, title: d.title, messages: d.messages || [] })));
      setActiveId(data[0].id);
    }
  }, [user]);
  useEffect(() => { if (user) loadHistory(); }, [user, loadHistory]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, isLoading]);

  const updateActive = (fn: (c: Chat) => Chat) =>
    setChats(prev => prev.map(c => (c.id === activeId ? fn(c) : c)));

  // Persist active chat (debounced) when logged in
  const persistActive = useCallback((c: Chat) => {
    if (!user) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      // Try update first; if not exists, insert
      const { data: existing } = await supabase.from("chats").select("id").eq("id", c.id).maybeSingle();
      if (existing) {
        await supabase.from("chats").update({ title: c.title, messages: c.messages as any }).eq("id", c.id);
      } else {
        const { data, error } = await supabase.from("chats").insert({
          id: c.id, user_id: user.id, title: c.title, messages: c.messages as any,
        }).select("id").maybeSingle();
        if (error) console.error(error);
        if (data?.id && data.id !== c.id) {
          setChats(p => p.map(x => x.id === c.id ? { ...x, id: data.id } : x));
          setActiveId(prev => prev === c.id ? data.id : prev);
        }
      }
    }, 600);
  }, [user]);

  const newChat = () => {
    const c = { id: uid(), title: "New chat", messages: [] };
    setChats(p => [c, ...p]);
    setActiveId(c.id);
  };

  const deleteChat = async (id: string) => {
    setChats(p => p.filter(c => c.id !== id));
    if (user) await supabase.from("chats").delete().eq("id", id);
    if (activeId === id) {
      const remaining = chats.filter(c => c.id !== id);
      if (remaining[0]) setActiveId(remaining[0].id); else newChat();
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() && attachments.length === 0) return;

    const userMsg: Msg = {
      role: "user", content: text,
      attachments: attachments.map(a => ({ name: a.name, type: a.type, url: a.data })),
    };

    const apiUserContent: any = attachments.length > 0
      ? [
          ...(text ? [{ type: "text", text }] : []),
          ...attachments.filter(a => a.type.startsWith("image/")).map(a => ({ type: "image_url", image_url: { url: a.data } })),
          ...attachments.filter(a => !a.type.startsWith("image/")).map(a => ({ type: "text", text: `[Attached file: ${a.name}]` })),
        ]
      : text;

    const newMessages = [...active.messages, userMsg];
    const newTitle = active.messages.length === 0 ? (text.slice(0, 40) || "New chat") : active.title;
    updateActive(c => ({ ...c, title: newTitle, messages: [...newMessages, { role: "assistant", content: "" }] }));
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    const apiMessages = newMessages.map(m =>
      m === userMsg ? { role: "user", content: apiUserContent } : { role: m.role, content: m.content }
    );

    abortRef.current = new AbortController();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, useWebSearch, mode, selectedAI }),
        signal: abortRef.current.signal,
      });

      if (resp.status === 429) { toast.error("Rate limit — please wait a moment."); setIsLoading(false); return; }
      if (resp.status === 402) { setShowCredits(true); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = ""; let assistant = ""; let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistant += c;
              updateActive(ch => {
                const msgs = [...ch.messages];
                msgs[msgs.length - 1] = { role: "assistant", content: assistant };
                return { ...ch, messages: msgs };
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      // Persist after stream completes
      const finalChat: Chat = { id: activeId, title: newTitle, messages: [...newMessages, { role: "assistant", content: assistant }] };
      persistActive(finalChat);
    } catch (e: any) {
      if (e.name !== "AbortError") { console.error(e); toast.error("Something went wrong. Try again."); }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [active, attachments, useWebSearch, activeId, persistActive, mode, selectedAI]);

  const stopStream = () => abortRef.current?.abort();

  // Voice input
  const recRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);
  const toggleVoice = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice input not supported in this browser"); return; }
    if (recording) { recRef.current?.stop(); return; }
    const r = new SR();
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    let finalText = "";
    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      setInput(finalText + interim);
    };
    r.onend = () => { setRecording(false); if (finalText.trim()) sendMessage(finalText.trim()); };
    r.onerror = () => setRecording(false);
    recRef.current = r;
    setRecording(true);
    r.start();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>, kind: "file" | "image" | "camera") => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachments(a => [...a, { name: f.name, type: f.type || (kind === "file" ? "application/octet-stream" : "image/png"), data: reader.result as string }]);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const empty = active.messages.length === 0;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="p-3">
          <Button onClick={newChat} variant="outline" className="w-full justify-start gap-2 border-border bg-transparent hover:bg-sidebar-accent">
            <Plus className="h-4 w-4 text-primary" /> New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map(c => (
            <div key={c.id} className={`group flex items-center rounded-md ${c.id === activeId ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"}`}>
              <button onClick={() => setActiveId(c.id)} className="flex-1 text-left px-3 py-2 text-sm truncate flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{c.title}</span>
              </button>
              <button onClick={() => deleteChat(c.id)} className="opacity-0 group-hover:opacity-100 px-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-sidebar-border text-xs text-muted-foreground">X COPPER · v1.0</div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 h-14 border-b border-border">
          <div className="flex items-center gap-2 font-semibold whitespace-nowrap">
            <span className="text-transparent bg-clip-text whitespace-nowrap" style={{ backgroundImage: "var(--gradient-copper)" }}>X COPPER</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5 text-primary" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Mode</DropdownMenuLabel>
                {MODES.map(m => {
                  const Icon = m.icon;
                  return (
                    <DropdownMenuItem key={m.id} onClick={() => { setMode(m.id); toast.success(`${m.label} mode`); }}>
                      <Icon className="h-4 w-4 mr-2 text-primary" />
                      <span className="flex-1">{m.label}</span>
                      {mode === m.id && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLiveOpen(true)}>
                  <Radio className="h-4 w-4 mr-2" /> Live mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={newChat}>
                  <Plus className="h-4 w-4 mr-2" /> New chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Account">
                  <UserIcon className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={async () => { await supabase.auth.signOut(); toast.success("Signed out"); }}>
                      <LogOut className="h-4 w-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setShowAuth(true)}>
                    <LogIn className="h-4 w-4 mr-2" /> Sign in / Sign up
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full overflow-hidden ring-2 ring-primary/40 hover:ring-primary transition h-9 w-9 flex items-center justify-center bg-card">
                  <XLogo className="h-7 w-7 object-contain" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-center">
                  <span className="text-transparent bg-clip-text font-bold tracking-wider" style={{ backgroundImage: "var(--gradient-copper)" }}>
                    MADE BY NAVYA PANCHAL
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {empty ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <XLogo className="h-28 w-28 mb-4 drop-shadow-[0_0_30px_oklch(0.68_0.13_45/0.4)]" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-copper)" }}>
                X COPPER
              </h1>
              <p className="mt-3 text-muted-foreground text-sm">Ask anything. Fast answers powered by AI.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
              {active.messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && <XLogo className="h-7 w-7 mt-1 shrink-0" />}
                  <div className={`flex flex-col max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-secondary text-foreground" : "bg-card border border-border animate-in fade-in slide-in-from-bottom-2 duration-500"}`}>
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {m.attachments.map((a, j) => a.type.startsWith("image/") && a.url ? (
                            <img key={j} src={a.url} alt={a.name} className="max-h-40 rounded-md" />
                          ) : (
                            <div key={j} className="text-xs px-2 py-1 rounded bg-muted">{a.name}</div>
                          ))}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {!m.content && isLoading && i === active.messages.length - 1 ? (
                          <XLogo className="h-6 w-6 animate-spin" />
                        ) : (
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                    {m.role === "assistant" && m.content && (
                      <button
                        onClick={() => speak(i, m.content)}
                        className="mt-2 ml-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition px-2 py-1 rounded-full hover:bg-accent"
                        title={speakingIdx === i ? "Stop" : "Listen"}
                      >
                        {speakingIdx === i ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        <span>{speakingIdx === i ? "Stop" : "Listen"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background">
          <div className="max-w-3xl mx-auto p-3">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md text-xs">
                    {a.type.startsWith("image/") ? <ImageIcon className="h-3 w-3" /> : <Paperclip className="h-3 w-3" />}
                    <span className="truncate max-w-[140px]">{a.name}</span>
                    <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-2">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoading) sendMessage(input);
                    }
                  }}
                  rows={1}
                  className="border-0 bg-transparent resize-none focus-visible:ring-0 min-h-[40px] max-h-40 relative z-10"
                />
                {!input && (
                  <span
                    key={placeholderIdx}
                    className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700"
                  >
                    {PLACEHOLDERS[placeholderIdx]}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-0.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-9 w-9" title="Attach">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-44 p-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => fileRef.current?.click()}>
                        <FileUp className="h-4 w-4" /> Files
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => imgRef.current?.click()}>
                        <ImageIcon className="h-4 w-4" /> Photo / Gallery
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => camRef.current?.click()}>
                        <Camera className="h-4 w-4" /> Camera
                      </button>
                    </PopoverContent>
                  </Popover>
                  <Button size="icon" variant={useWebSearch ? "default" : "ghost"} title="Search the web"
                    className={`h-9 w-9 ${useWebSearch ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                    onClick={() => setUseWebSearch(v => !v)}>
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-primary" title="Live X COPPER" onClick={() => setLiveOpen(true)}>
                    <Radio className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant={recording ? "default" : "ghost"} className="h-9 w-9" onClick={toggleVoice}>
                    <Mic className={`h-4 w-4 ${recording ? "animate-pulse" : ""}`} />
                  </Button>
                  {isLoading ? (
                    <Button size="icon" className="h-9 w-9" onClick={stopStream}><Square className="h-4 w-4" /></Button>
                  ) : (
                    <Button size="icon" className="h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => sendMessage(input)} disabled={!input.trim() && attachments.length === 0}>
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-center text-muted-foreground mt-2">X COPPER can make mistakes. Verify important info.</p>
          </div>
        </div>

        <input ref={fileRef} type="file" hidden onChange={e => onFile(e, "file")} />
        <input ref={imgRef} type="file" accept="image/*" hidden onChange={e => onFile(e, "image")} />
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={e => onFile(e, "camera")} />
      </main>

      <Dialog open={showCredits} onOpenChange={setShowCredits}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add credits</DialogTitle>
            <DialogDescription>You've reached the free usage limit. Add credits in Workspace → Usage to continue.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Configure your X COPPER experience.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="general" className="pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" />History</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Language for live mode</label>
                <LanguagePicker value={language} onChange={setLanguage} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Voice (Listen & Live)</label>
                <VoicePicker voices={voices} value={voiceMode} onChange={setVoiceMode} />
                <p className="text-[11px] text-muted-foreground mt-1">Choose a voice for read-aloud and Live X COPPER.</p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="pt-4">
              {!user ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-muted-foreground">Sign in to save and access your chat history across devices.</p>
                  <Button onClick={() => { setShowSettings(false); setShowAuth(true); }}>
                    <LogIn className="h-4 w-4 mr-2" /> Sign in
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Your saved chats</p>
                    <Button size="sm" variant="ghost" onClick={loadHistory}><RefreshCw className="h-3.5 w-3.5" /></Button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {chats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No chats yet.</p>}
                    {chats.map(c => (
                      <div key={c.id} className="flex items-center justify-between px-2 py-2 rounded hover:bg-accent">
                        <button className="flex-1 text-left text-sm truncate" onClick={() => { setActiveId(c.id); setShowSettings(false); }}>
                          {c.title}
                        </button>
                        <button onClick={() => deleteChat(c.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuth} onClose={() => setShowAuth(false)} />

      <LiveMode open={liveOpen} onClose={() => setLiveOpen(false)} language={language} voiceMode={voiceMode} voices={voices} selectedAI={selectedAI} />
    </div>
  );
}

function LanguagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {value}
          <Search className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {LANGUAGES.map(l => (
                <CommandItem key={l} value={l} onSelect={() => { onChange(l); setOpen(false); }}>
                  <Check className={`h-4 w-4 mr-2 ${value === l ? "opacity-100" : "opacity-0"}`} />
                  {l}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const FEMALE_HINTS = ["female", "woman", "girl", "samantha", "victoria", "karen", "tessa", "fiona", "moira", "veena", "rishi-female", "google उच्च-गुणवत्ता", "zira", "susan", "hazel", "serena", "allison", "ava", "siri female"];
const MALE_HINTS = ["male", "man", "boy", "daniel", "alex", "fred", "tom", "oliver", "rishi", "david", "mark", "george", "arthur", "aaron", "siri male"];

function pickVoice(voices: SpeechSynthesisVoice[], gender: "female" | "male"): SpeechSynthesisVoice | undefined {
  const hints = gender === "female" ? FEMALE_HINTS : MALE_HINTS;
  const other = gender === "female" ? MALE_HINTS : FEMALE_HINTS;
  const match = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase();
    return hints.some(h => n.includes(h)) && !other.some(h => n.includes(h));
  };
  return voices.find(v => v.lang.startsWith("en") && match(v))
      || voices.find(match)
      || (gender === "female" ? voices.find(v => v.lang.startsWith("en")) : voices.slice().reverse().find(v => v.lang.startsWith("en")));
}

function VoicePicker({ voices, value, onChange }: { voices: SpeechSynthesisVoice[]; value: string; onChange: (v: string) => void }) {
  const female = pickVoice(voices, "female");
  const male = pickVoice(voices, "male");
  const options = [
    { id: "female", label: "Girl voice", voice: female },
    { id: "male", label: "Boy voice", voice: male },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(o => {
        const uri = o.voice?.voiceURI || "";
        const active = value === uri && uri !== "";
        return (
          <button
            key={o.id}
            onClick={() => uri && onChange(uri)}
            disabled={!o.voice}
            className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition ${active ? "border-primary bg-primary/10" : "border-border hover:bg-accent"} disabled:opacity-50`}
          >
            <div className="flex items-center gap-2 w-full">
              <Volume2 className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium flex-1">{o.label}</span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </div>
            <span className="text-[11px] text-muted-foreground truncate w-full">{o.voice?.name || "Unavailable"}</span>
          </button>
        );
      })}
    </div>
  );
}

function AuthDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  const google = async () => {
    setBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { toast.error("Google sign-in failed"); setBusy(false); return; }
    if (r.redirected) return;
    toast.success("Signed in"); onClose();
    setBusy(false);
  };

  const submit = async () => {
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) toast.error(error.message);
      else { toast.success("Check your email to verify your account."); onClose(); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("Signed in"); onClose(); }
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-transparent bg-clip-text font-bold tracking-wider" style={{ backgroundImage: "var(--gradient-copper)" }}>
              {mode === "signin" ? "Sign in to X COPPER" : "Create your X COPPER account"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Save your chat history securely across devices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={google} disabled={busy}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.4 1.6 14.9.5 12 .5 7.4.5 3.5 3.1 1.6 7l3.6 2.8C6.2 6.9 8.9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.2 2.7-2.5 3.6l3.6 2.8c2.1-2 3.4-4.9 3.4-8.6z"/><path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.6 6.9C.6 8.5 0 10.2 0 12s.6 3.5 1.6 5.1l3.6-2.8z"/><path fill="#34A853" d="M12 23.5c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-3.1 0-5.8-1.9-6.8-4.8L1.6 17.1C3.5 21 7.4 23.5 12 23.5z"/></svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>

          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative">
            <Input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={submit} disabled={busy}>
            {mode === "signin" ? "Sign in" : "Sign up"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button className="text-primary hover:underline" onClick={() => setMode(m => m === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LiveMode({ open, onClose, language, voiceURI }: { open: boolean; onClose: () => void; language: string; voiceURI: string }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [camOn, setCamOn] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<any>(null);
  const camOnRef = useRef(false);
  useEffect(() => { camOnRef.current = camOn; }, [camOn]);

  const captureFrame = (): string | null => {
    const v = videoRef.current;
    if (!v || !streamRef.current || v.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  const langCode = (l: string) => ({
    English: "en-US", Hindi: "hi-IN", Spanish: "es-ES", French: "fr-FR",
    German: "de-DE", Japanese: "ja-JP", Arabic: "ar-SA",
    Chinese: "zh-CN", Portuguese: "pt-BR", Russian: "ru-RU", Italian: "it-IT",
    Korean: "ko-KR", Bengali: "bn-IN", Turkish: "tr-TR", Dutch: "nl-NL",
    Urdu: "ur-PK", Tamil: "ta-IN",
  } as Record<string, string>)[l] || "en-US";

  const startCamera = async (mode: "user" | "environment" = facing) => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play(); }
      setCamOn(true);
    } catch { toast.error("Camera permission denied"); }
  };
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamOn(false);
  };
  const switchCamera = async () => {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    if (camOn) await startCamera(next);
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode(language);
    u.rate = 1;
    u.pitch = 1;
    const v = window.speechSynthesis.getVoices().find(x => x.voiceURI === voiceURI);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  const start = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice not supported"); return; }
    const r = new SR();
    r.lang = langCode(language); r.continuous = false; r.interimResults = true;
    let final = "";
    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final + interim);
    };
    r.onend = async () => {
      setListening(false);
      if (!final.trim()) return;
      setResponse("…");
      try {
        const frame = camOnRef.current ? captureFrame() : null;
        const userContent: any = frame
          ? [
              { type: "text", text: `Reply briefly in ${language}. The user is showing this live camera view. ${final}` },
              { type: "image_url", image_url: { url: frame } },
            ]
          : `Reply briefly in ${language}. ${final}`;
        const sysContent =
          "You are X COPPER in LIVE mode, created by Navya Panchal. " +
          (camOnRef.current
            ? "The user's camera is ON — an image of what they are seeing is attached. Look at it and answer based on what is visible."
            : "The user's camera is OFF. If they ask anything that requires you to see them or their surroundings (e.g. 'what is this', 'look at this', 'see my screen', 'what am I holding'), reply that the camera is off and ask them to turn it on. Otherwise answer normally.") +
          " Never mention any underlying model or provider.";
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({
            messages: [
              { role: "system", content: sysContent },
              { role: "user", content: userContent },
            ],
          }),
        });
        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let buf = "", out = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const j = line.slice(6).trim();
            if (j === "[DONE]") continue;
            try {
              const c = JSON.parse(j).choices?.[0]?.delta?.content;
              if (c) { out += c; setResponse(out); }
            } catch { buf = line + "\n" + buf; break; }
          }
        }
        speak(out);
      } catch { toast.error("Live error"); }
    };
    recRef.current = r;
    setTranscript(""); setResponse("");
    setListening(true);
    r.start();
  };

  const stop = () => recRef.current?.stop();

  useEffect(() => {
    if (!open) {
      recRef.current?.stop?.();
      stopCamera();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" /> Live X COPPER
          </DialogTitle>
          <DialogDescription>Speak naturally — language: {language}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-border flex items-center justify-center">
            <video ref={videoRef} playsInline muted className={`w-full h-full object-cover ${camOn ? "" : "hidden"}`} />
            {!camOn && <span className="text-xs text-muted-foreground">Camera off</span>}
            {camOn && (
              <button onClick={switchCamera} className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80" title="Switch camera">
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={camOn ? stopCamera : () => startCamera()} title="Camera">
              {camOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <button
              onClick={listening ? stop : start}
              className={`relative h-20 w-20 rounded-full flex items-center justify-center transition ${listening ? "animate-pulse" : ""}`}
              style={{ background: "var(--gradient-copper)" }}
            >
              <Mic className="h-8 w-8 text-background" />
              {listening && <span className="absolute inset-0 rounded-full ring-4 ring-primary/40 animate-ping" />}
            </button>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={onClose} title="End">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{listening ? "Listening…" : "Tap mic to talk"}</p>
          {transcript && <div className="text-sm bg-muted p-3 rounded-md w-full"><b>You:</b> {transcript}</div>}
          {response && <div className="text-sm bg-card border border-border p-3 rounded-md w-full"><b>X COPPER:</b> {response}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

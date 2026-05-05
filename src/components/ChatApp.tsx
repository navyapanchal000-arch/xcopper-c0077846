import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Plus, Mic, Globe, Paperclip, Image as ImageIcon, Send, Sparkles,
  MessageSquare, Settings, MoreVertical, Radio, X, Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { XLogo } from "@/components/XLogo";

type Msg = { role: "user" | "assistant"; content: string; attachments?: { name: string; type: string; url?: string }[] };
type Chat = { id: string; title: string; messages: Msg[] };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const LANGUAGES = [
  "English","Hindi","Spanish","French","German","Japanese","Chinese","Arabic",
  "Portuguese","Russian","Italian","Korean","Bengali","Urdu","Turkish",
];

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([{ id: uid(), title: "New chat", messages: [] }]);
  const [activeId, setActiveId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: string; data: string }[]>([]);
  const [showCredits, setShowCredits] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("English");
  const [liveOpen, setLiveOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const active = chats.find(c => c.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, isLoading]);

  const updateActive = (fn: (c: Chat) => Chat) =>
    setChats(prev => prev.map(c => (c.id === activeId ? fn(c) : c)));

  const newChat = () => {
    const c = { id: uid(), title: "New chat", messages: [] };
    setChats(p => [c, ...p]);
    setActiveId(c.id);
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() && attachments.length === 0) return;

    const userMsg: Msg = {
      role: "user",
      content: text,
      attachments: attachments.map(a => ({ name: a.name, type: a.type, url: a.data })),
    };

    // Build payload — for images, pass as multimodal content
    const apiUserContent: any = attachments.length > 0
      ? [
          ...(text ? [{ type: "text", text }] : []),
          ...attachments
            .filter(a => a.type.startsWith("image/"))
            .map(a => ({ type: "image_url", image_url: { url: a.data } })),
          ...attachments
            .filter(a => !a.type.startsWith("image/"))
            .map(a => ({ type: "text", text: `[Attached file: ${a.name}]` })),
        ]
      : text;

    const newMessages = [...active.messages, userMsg];
    updateActive(c => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 40) || "New chat" : c.title,
      messages: [...newMessages, { role: "assistant", content: "" }],
    }));
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
        body: JSON.stringify({ messages: apiMessages, useWebSearch }),
        signal: abortRef.current.signal,
      });

      if (resp.status === 429) { toast.error("Rate limit — please wait a moment."); setIsLoading(false); return; }
      if (resp.status === 402) { setShowCredits(true); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistant = "";
      let done = false;

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
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error(e);
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [active, attachments, useWebSearch]);

  const stopStream = () => abortRef.current?.abort();

  // Voice input
  const recRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);
  const toggleVoice = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice input not supported in this browser"); return; }
    if (recording) { recRef.current?.stop(); return; }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    let finalText = "";
    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      setInput(finalText + interim);
    };
    r.onend = () => {
      setRecording(false);
      if (finalText.trim()) sendMessage(finalText.trim());
    };
    r.onerror = () => setRecording(false);
    recRef.current = r;
    setRecording(true);
    r.start();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>, kind: "file" | "image") => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachments(a => [...a, { name: f.name, type: f.type || (kind === "image" ? "image/png" : "application/octet-stream"), data: reader.result as string }]);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const empty = active.messages.length === 0;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="p-3">
          <Button onClick={newChat} variant="outline" className="w-full justify-start gap-2 border-border bg-transparent hover:bg-sidebar-accent">
            <Plus className="h-4 w-4 text-primary" /> New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm truncate flex items-center gap-2 ${
                c.id === activeId ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-sidebar-border text-xs text-muted-foreground">
          X COPPER · v1.0
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-border">
          <div className="flex items-center gap-2 font-semibold whitespace-nowrap">
            <span className="text-transparent bg-clip-text whitespace-nowrap" style={{ backgroundImage: "var(--gradient-copper)" }}>X COPPER</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
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

        {/* Messages / Empty state */}
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
                  <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                    m.role === "user" ? "bg-secondary text-foreground" : "bg-card border border-border"
                  }`}>
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
                      <ReactMarkdown>{m.content || (isLoading && i === active.messages.length - 1 ? "▍" : "")}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
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
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading) sendMessage(input);
                  }
                }}
                placeholder="Ask chat X"
                rows={1}
                className="border-0 bg-transparent resize-none focus-visible:ring-0 min-h-[40px] max-h-40"
              />
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-0.5">
                  <Button size="icon" variant="ghost" className="h-9 w-9" title="Attach file" onClick={() => fileRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9" title="Attach image" onClick={() => imgRef.current?.click()}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={useWebSearch ? "default" : "ghost"}
                    title="Search the web"
                    className={`h-9 w-9 ${useWebSearch ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                    onClick={() => setUseWebSearch(v => !v)}
                  >
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
                    <Button size="icon" className="h-9 w-9" onClick={stopStream}>
                      <Square className="h-4 w-4" />
                    </Button>
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
      </main>

      {/* Credits dialog */}
      <Dialog open={showCredits} onOpenChange={setShowCredits}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add credits</DialogTitle>
            <DialogDescription>You've reached the free usage limit. Add credits in Workspace → Usage to continue.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Configure your X COPPER experience.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Language for live mode</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live mode dialog */}
      <LiveMode open={liveOpen} onClose={() => setLiveOpen(false)} language={language} />
    </div>
  );
}

function LiveMode({ open, onClose, language }: { open: boolean; onClose: () => void; language: string }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recRef = useRef<any>(null);

  const langCode = (l: string) => ({
    English: "en-US", Hindi: "hi-IN", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    Japanese: "ja-JP", Chinese: "zh-CN", Arabic: "ar-SA", Portuguese: "pt-BR", Russian: "ru-RU",
    Italian: "it-IT", Korean: "ko-KR", Bengali: "bn-IN", Urdu: "ur-PK", Turkish: "tr-TR",
  } as Record<string, string>)[l] || "en-US";

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode(language);
    window.speechSynthesis.speak(u);
  };

  const start = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice not supported"); return; }
    const r = new SR();
    r.lang = langCode(language);
    r.continuous = false;
    r.interimResults = true;
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
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Reply briefly in ${language}. ${final}` }],
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
        <div className="flex flex-col items-center gap-6 py-6">
          <button
            onClick={listening ? stop : start}
            className={`relative h-32 w-32 rounded-full flex items-center justify-center transition ${
              listening ? "animate-pulse" : ""
            }`}
            style={{ background: "var(--gradient-copper)" }}
          >
            <Mic className="h-12 w-12 text-background" />
            {listening && (
              <span className="absolute inset-0 rounded-full ring-4 ring-primary/40 animate-ping" />
            )}
          </button>
          <p className="text-sm text-muted-foreground">{listening ? "Listening…" : "Tap to talk"}</p>
          {transcript && <div className="text-sm bg-muted p-3 rounded-md w-full"><b>You:</b> {transcript}</div>}
          {response && <div className="text-sm bg-card border border-border p-3 rounded-md w-full"><b>X COPPER:</b> {response}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
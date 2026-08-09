import { useEffect, useState } from "react";

type AlertItem = { id: number; title?: string; message: string };

let push: ((a: AlertItem) => void) | null = null;
let seq = 0;

/** Centered copper-bordered popup with an OK button. */
export function showAlert(message: string, title?: string) {
  const item = { id: ++seq, message, title };
  if (push) push(item);
  else if (typeof window !== "undefined") console.warn("[alert]", message);
}

export function AlertHost() {
  const [queue, setQueue] = useState<AlertItem[]>([]);
  useEffect(() => {
    push = (a) => setQueue((q) => (q.some((x) => x.message === a.message) ? q : [...q, a]));
    return () => { push = null; };
  }, []);

  const current = queue[0];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md p-6 animate-in fade-in duration-200"
      style={{ zIndex: 2147483000, pointerEvents: "auto" }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-card p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ border: "2px solid transparent", backgroundImage: "linear-gradient(var(--card), var(--card)), var(--gradient-copper)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}
      >
        {current.title && (
          <p className="mb-1 text-sm font-semibold text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-copper)" }}>
            {current.title}
          </p>
        )}
        <p className="text-sm text-foreground">{current.message}</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setQueue((q) => q.slice(1)); }}
          className="mt-5 w-full rounded-full py-2 text-sm font-semibold text-background cursor-pointer"
          style={{ background: "var(--gradient-copper)", pointerEvents: "auto" }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

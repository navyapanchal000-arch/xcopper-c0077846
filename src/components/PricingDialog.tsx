import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Gem, Sparkles } from "lucide-react";
import { useAppSettings, type Tier } from "@/lib/appSettings";

export function PricingDialog({
  open, onClose, current,
}: { open: boolean; onClose: () => void; current: Tier }) {
  const s = useAppSettings();

  const plans = [
    { id: "free" as Tier, name: "Stay free", price: "0", icon: Sparkles, perks: s.free_features },
    { id: "premium" as Tier, name: s.premium_label, price: String(s.premium_price), icon: Crown, perks: s.premium_features },
    { id: "platinum" as Tier, name: s.platinum_label, price: String(s.platinum_price), icon: Gem, perks: s.platinum_features },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-transparent bg-clip-text font-bold tracking-wider" style={{ backgroundImage: "var(--gradient-copper)" }}>
              Upgrade {s.ai_name}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Swipe right to see Premium and Platinum plans.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2">
          {plans.map((p) => {
            const Icon = p.icon;
            const isCurrent = current === p.id;
            return (
              <div
                key={p.id}
                className={`snap-center shrink-0 w-[85%] sm:w-[calc(33.333%-0.5rem)] rounded-2xl border p-4 flex flex-col ${
                  isCurrent ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{p.name}</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-copper)" }}>
                  {s.currency}{p.price}
                  <span className="text-xs text-muted-foreground font-normal"> / month</span>
                </div>
                <ul className="mt-3 space-y-2 flex-1">
                  {p.perks.map((x) => (
                    <li key={x} className="flex gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full"
                  variant={p.id === "free" ? "outline" : "default"}
                  disabled={isCurrent}
                  onClick={onClose}
                >
                  {isCurrent ? "Current plan" : p.id === "free" ? "Stay on free" : `Get ${p.name}`}
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-center text-muted-foreground">
          Plans are activated by the {s.ai_name} team after payment confirmation.
        </p>
      </DialogContent>
    </Dialog>
  );
}

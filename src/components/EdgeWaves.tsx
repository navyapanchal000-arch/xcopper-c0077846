/**
 * Copper wave that runs only along the outer borders/edges of its parent.
 * The center always stays clear.
 */
export function EdgeWaves({ active, thickness = 4 }: { active: boolean; thickness?: number }) {
  const h = `repeating-linear-gradient(90deg, transparent 0px, oklch(0.78 0.14 50) 40px, oklch(0.55 0.13 40) 80px, transparent 120px)`;
  const v = `repeating-linear-gradient(180deg, transparent 0px, oklch(0.78 0.14 50) 40px, oklch(0.55 0.13 40) 80px, transparent 120px)`;
  const base = { backgroundSize: "200% 100%", opacity: active ? 1 : 0.18 } as const;
  const dur = active ? "2.2s" : "6s";

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div style={{ ...base, position: "absolute", top: 0, left: 0, right: 0, height: thickness, backgroundImage: h, animation: `copper-wave-x ${dur} linear infinite, copper-edge-breathe 3s ease-in-out infinite` }} />
      <div style={{ ...base, position: "absolute", bottom: 0, left: 0, right: 0, height: thickness, backgroundImage: h, animation: `copper-wave-x ${dur} linear infinite reverse, copper-edge-breathe 3s ease-in-out infinite` }} />
      <div style={{ ...base, backgroundSize: "100% 200%", position: "absolute", top: 0, bottom: 0, left: 0, width: thickness, backgroundImage: v, animation: `copper-wave-y ${dur} linear infinite, copper-edge-breathe 3s ease-in-out infinite` }} />
      <div style={{ ...base, backgroundSize: "100% 200%", position: "absolute", top: 0, bottom: 0, right: 0, width: thickness, backgroundImage: v, animation: `copper-wave-y ${dur} linear infinite reverse, copper-edge-breathe 3s ease-in-out infinite` }} />
      {active && (
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 60px -20px oklch(0.68 0.13 45 / 0.7)" }} />
      )}
    </div>
  );
}

import { FeatureContribution } from "@/lib/scoring";

export function ShapWaterfall({ contribs }: { contribs: FeatureContribution[] }) {
  const sorted = [...contribs].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 10);
  const max = Math.max(...sorted.map((c) => Math.abs(c.contribution)));
  return (
    <div className="space-y-2">
      {sorted.map((c) => {
        const pct = (Math.abs(c.contribution) / max) * 100;
        const isUp = c.direction === "up";
        return (
          <div key={c.key} className="grid grid-cols-[1fr_2fr_auto] items-center gap-3 text-xs">
            <div className="truncate font-medium text-foreground">{c.label}</div>
            <div className="relative h-6 rounded-sm bg-muted">
              <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
              <div
                className={`absolute top-0 h-full ${
                  isUp ? "left-1/2 bg-destructive/70" : "right-1/2 bg-success/70"
                }`}
                style={{ width: `${pct / 2}%` }}
              />
            </div>
            <div className={`num-fr font-mono text-xs font-semibold ${isUp ? "text-destructive" : "text-success"}`}>
              {isUp ? "+" : "−"}
              {Math.abs(c.contribution).toFixed(2)}
            </div>
          </div>
        );
      })}
      <div className="mt-3 flex items-center gap-4 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-destructive/70" /> Augmente la PD</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-success/70" /> Réduit la PD</span>
      </div>
    </div>
  );
}

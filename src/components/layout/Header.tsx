import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold text-primary">Sami-CrediScore</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Risk Analytics Platform
            </div>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-xs text-muted-foreground md:flex">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Modèles en service
          </span>
          <span className="font-mono">v1.0 · UPEC 2025-2026</span>
        </div>
      </div>
    </header>
  );
}

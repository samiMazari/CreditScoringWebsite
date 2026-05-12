import { Link } from "@tanstack/react-router";
import { Home, BarChart3, Cpu, Search, BookOpen, GraduationCap } from "lucide-react";

const items = [
  { to: "/" as const, label: "Tableau de bord", icon: Home },
  { to: "/analyses" as const, label: "Analyses", icon: BarChart3 },
  { to: "/modeles" as const, label: "Modèles", icon: Cpu },
  { to: "/simulateur" as const, label: "Simulateur", icon: Search, highlight: true },
  { to: "/methodologie" as const, label: "Méthodologie", icon: BookOpen },
  { to: "/a-propos" as const, label: "À propos", icon: GraduationCap },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        <div className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Navigation
        </div>
        {items.map(({ to, label, icon: Icon, highlight }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {highlight && (
              <span className="rounded-sm bg-gold/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold group-data-[status=active]:bg-primary-foreground/15 group-data-[status=active]:text-primary-foreground">
                Live
              </span>
            )}
          </Link>
        ))}

        <div className="mt-8 rounded-sm border border-border bg-secondary/50 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mémoire de recherche
          </div>
          <p className="mt-2 font-serif text-sm leading-snug text-foreground">
            Modélisation du score de crédit bancaire à l'aide du machine learning
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Mohamed Sami Mazari — M1 Économie Appliquée, UPEC
          </p>
        </div>
      </nav>
    </aside>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Database, Download, Github, ShieldCheck, TrendingUp } from "lucide-react";
import { fmtNum } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — CrediScore AI" },
      {
        name: "description",
        content:
          "Plateforme d'évaluation du risque de crédit fondée sur 307 511 demandes Home Credit et trois modèles de scoring (Logit, Random Forest, XGBoost).",
      },
    ],
  }),
  component: Index,
});

const KPIS = [
  { value: fmtNum(307511), label: "Demandes analysées", sub: "Échantillon Home Credit", icon: Database },
  { value: "8,07 %", label: "Taux de défaut moyen", sub: "Variable TARGET", icon: TrendingUp },
  { value: "0,756", label: "AUC modèle final", sub: "XGBoost", icon: ShieldCheck },
  { value: "16", label: "Variables explicatives", sub: "+ 4 ratios dérivés", icon: BarChart3 },
];

const PIPELINE = [
  "Données brutes",
  "Nettoyage",
  "Feature engineering",
  "Modélisation",
  "Évaluation",
  "Décision",
];

function Index() {
  return (
    <div className="space-y-12">
      {/* Bannière */}
      <section className="overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Mémoire de recherche · UPEC 2025-2026
            </div>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Plateforme d'évaluation
              <br />
              <span className="text-gold">du risque de crédit</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/80">
              Analyse statistique et intelligence artificielle au service de la
              décision bancaire — régression logistique, Random Forest et XGBoost
              avec explicabilité SHAP conforme au RGPD et à l'AI Act.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/simulateur"
                className="group inline-flex items-center gap-2 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground transition-all hover:bg-gold/90"
              >
                Évaluer une demande de crédit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/modeles"
                className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/30 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Consulter les analyses
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-sm border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
              <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Hypothèses validées empiriquement
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  ["H2", "Stabilité de l'emploi ↓ défaut", "OR = 0,83"],
                  ["H3", "Endettement (DTI) ↑ défaut", "OR = 1,16"],
                  ["H4", "Historique externe ↑↑ pouvoir prédictif", "p < 0,001"],
                ].map(([h, txt, stat]) => (
                  <li key={h} className="flex items-start gap-3 border-b border-primary-foreground/10 pb-3 last:border-0">
                    <span className="rounded-sm bg-gold/20 px-2 py-0.5 font-mono text-xs font-semibold text-gold">{h}</span>
                    <div className="flex-1">
                      <div>{txt}</div>
                      <div className="font-mono text-xs text-primary-foreground/60">{stat}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {KPIS.map(({ value, label, sub, icon: Icon }) => (
          <div key={label} className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <Icon className="h-4 w-4 text-primary/60" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">KPI</span>
            </div>
            <div className="mt-4 num-fr font-mono text-2xl font-semibold text-primary md:text-3xl">{value}</div>
            <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </section>

      {/* Présentation */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-md border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Contexte académique</div>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-primary">
            Modélisation du score de crédit bancaire à l'aide du machine learning
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Cette plateforme matérialise les conclusions empiriques d'un mémoire
            de fin d'études dirigé par M. Sylvain Cherayron à l'Université
            Paris-Est Créteil. L'étude examine dans quelle mesure le revenu, la
            stabilité de l'emploi, le niveau d'endettement et l'historique de
            remboursement influencent la probabilité de défaut, et compare la
            performance prédictive de trois familles de modèles : régression
            logistique, Random Forest et XGBoost.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            La conclusion centrale recommande une approche hybride : la
            régression logistique pour les décisions individuelles nécessitant
            une justification réglementaire, XGBoost pour la gestion de
            portefeuille à grande échelle, et SHAP pour assurer une
            explicabilité post-hoc conforme aux exigences du RGPD et de l'AI Act.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Download className="h-3.5 w-3.5" /> Télécharger le mémoire (PDF)
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Github className="h-3.5 w-3.5" /> Voir le code source
            </a>
          </div>
        </article>

        <aside className="rounded-md border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Pipeline de traitement</div>
          <h3 className="mt-2 font-serif text-lg font-semibold text-primary">Workflow de modélisation</h3>
          <ol className="mt-6 space-y-4">
            {PIPELINE.map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-secondary font-mono text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 text-sm font-medium text-foreground">{step}</div>
                {i < PIPELINE.length - 1 && (
                  <div className="h-px w-6 bg-border" aria-hidden />
                )}
              </li>
            ))}
          </ol>
          <Link
            to="/methodologie"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-glow"
          >
            Détail méthodologique <ArrowRight className="h-3 w-3" />
          </Link>
        </aside>
      </section>
    </div>
  );
}

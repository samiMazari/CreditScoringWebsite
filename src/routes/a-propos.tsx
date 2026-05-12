import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — CrediScore AI" },
      { name: "description", content: "Auteur, encadrement institutionnel, bibliographie et mentions légales." },
    ],
  }),
  component: AboutPage,
});

const REFS = [
  ["Akerlof, G. (1970)", "The Market for Lemons : Quality Uncertainty and the Market Mechanism", "QJE"],
  ["Stiglitz, J. & Weiss, A. (1981)", "Credit Rationing in Markets with Imperfect Information", "AER"],
  ["Friedman, M. (1957)", "A Theory of the Consumption Function", "Princeton UP"],
  ["Breiman, L. (2001)", "Random Forests", "Machine Learning, 45(1)"],
  ["Chen, T. & Guestrin, C. (2016)", "XGBoost : A Scalable Tree Boosting System", "KDD '16"],
  ["Lundberg, S. & Lee, S.-I. (2017)", "A Unified Approach to Interpreting Model Predictions", "NeurIPS"],
  ["Lessmann, S. et al. (2015)", "Benchmarking state-of-the-art classification algorithms for credit scoring", "EJOR"],
  ["Dastile, X. et al. (2020)", "Statistical and machine learning models in credit scoring", "Applied Soft Computing"],
  ["Wiginton, J. C. (1980)", "A Note on the Comparison of Logit and Discriminant Models", "JFQA"],
  ["Shapley, L. (1953)", "A Value for n-Person Games", "Princeton UP"],
];

function AboutPage() {
  return (
    <div className="space-y-10">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">À propos</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-primary">Auteur, encadrement et références</h1>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-primary to-primary-glow font-serif text-2xl font-semibold text-primary-foreground">
              MS
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-primary">Mohamed Sami Mazari</h2>
              <p className="text-sm text-muted-foreground">M1 Économie Appliquée — MASERATI / GP IA</p>
              <p className="text-xs text-muted-foreground">Université Paris-Est Créteil · 2025-2026</p>
            </div>
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Domaines d'expertise</div>
            <div className="flex flex-wrap gap-1.5">
              {["Économétrie", "Machine Learning", "Credit Scoring", "Python", "SHAP", "Risk Analytics"].map((t) => (
                <span key={t} className="rounded-sm border border-border bg-secondary px-2 py-1 text-xs text-foreground">{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="#" className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"><Mail className="h-3.5 w-3.5" />Email</a>
            <a href="#" className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"><Linkedin className="h-3.5 w-3.5" />LinkedIn</a>
            <a href="#" className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"><Github className="h-3.5 w-3.5" />GitHub</a>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Encadrement</div>
          <h3 className="mt-1 font-serif text-xl font-semibold text-primary">Université Paris-Est Créteil</h3>
          <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            {[
              ["Encadrant", "M. Sylvain Cherayron"],
              ["Master", "M1 Économie Appliquée"],
              ["Parcours", "MASERATI — GP IA"],
              ["Année", "2025-2026"],
              ["Soutenance", "Session 2026"],
              ["Mention", "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Bibliographie sélective</div>
        <h2 className="mt-1 font-serif text-xl font-semibold text-primary">10 références majeures</h2>
        <ol className="mt-5 divide-y divide-border">
          {REFS.map(([a, t, j], i) => (
            <li key={i} className="flex gap-4 py-3 text-sm">
              <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{a}</div>
                <div className="text-muted-foreground">« {t} »</div>
                <div className="text-xs text-muted-foreground">{j}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-md border-l-4 border-l-gold bg-secondary/40 p-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Mentions légales</div>
        <h2 className="mt-1 font-serif text-lg font-semibold text-primary">Avertissement et conformité</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <li>• Cette plateforme est un outil éducatif et de démonstration académique.</li>
          <li>• Les prédictions ne constituent en aucun cas une décision bancaire réelle.</li>
          <li>• Conforme RGPD : aucune donnée saisie n'est stockée ni transmise.</li>
          <li>• Code source ouvert publié sous licence MIT.</li>
          <li>• Données issues du dataset public Home Credit Default Risk (Kaggle, 2018).</li>
        </ul>
      </section>
    </div>
  );
}

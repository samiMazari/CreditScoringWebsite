import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  calcDerived,
  computeContributions,
  generateRecommendations,
  makeDecision,
  predictModels,
  PRESETS,
  UserInput,
  type EducationType,
  type FamilyStatus,
  type Gender,
  type IncomeType,
} from "@/lib/scoring";
import { fmtEuro, fmtPct } from "@/lib/format";
import { ShapWaterfall } from "@/components/ShapWaterfall";
import { AlertTriangle, CheckCircle2, Lightbulb, Loader2, Rocket, XCircle } from "lucide-react";

export const Route = createFileRoute("/simulateur")({
  head: () => ({
    meta: [
      { title: "Simulateur de décision — CrediScore AI" },
      {
        name: "description",
        content:
          "Simulateur interactif d'octroi de crédit avec décision finale et explication SHAP individuelle.",
      },
    ],
  }),
  component: SimulatorPage,
});

const DEFAULT: UserInput = PRESETS.cadre;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] font-mono text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-sm border border-input bg-card px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

function SimulatorPage() {
  const [u, setU] = useState<UserInput>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);

  const set = <K extends keyof UserInput>(k: K, v: UserInput[K]) => setU((p) => ({ ...p, [k]: v }));

  const derived = useMemo(() => calcDerived(u), [u]);
  const contribs = useMemo(() => computeContributions(u, derived), [u, derived]);
  const preds = useMemo(() => predictModels(contribs), [contribs]);
  const decision = useMemo(() => makeDecision(preds.xgb), [preds.xgb]);
  const recs = useMemo(() => generateRecommendations(contribs, u, derived), [contribs, u, derived]);

  const positive = contribs.filter((c) => c.direction === "up").sort((a, b) => b.contribution - a.contribution).slice(0, 4);
  const negative = contribs.filter((c) => c.direction === "down").sort((a, b) => a.contribution - b.contribution).slice(0, 4);

  const analyze = () => {
    setLoading(true);
    setShown(false);
    setTimeout(() => {
      setLoading(false);
      setShown(true);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Module central</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-primary">Simulateur de décision d'octroi</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Saisissez les caractéristiques d'un emprunteur fictif. Trois modèles
          (régression logistique, Random Forest, XGBoost) calculent la
          probabilité de défaut et restituent une décision motivée par une
          analyse SHAP individuelle.
        </p>
      </div>

      {/* Profils types */}
      <div className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Profils types pré-remplis
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ["cadre", "Jeune cadre", "28 ans · 50 K€"],
            ["retraite", "Retraité", "65 ans · 25 K€"],
            ["independant", "Indépendant", "42 ans · 35 K€"],
            ["etudiant", "Étudiant", "22 ans · 15 K€"],
          ].map(([k, t, s]) => (
            <button
              key={k}
              onClick={() => { setU(PRESETS[k]); setShown(false); }}
              className="rounded-sm border border-border bg-secondary/40 p-3 text-left transition-colors hover:border-primary hover:bg-secondary"
            >
              <div className="text-sm font-semibold text-foreground">{t}</div>
              <div className="text-xs text-muted-foreground">{s}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations personnelles */}
        <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-serif text-lg font-semibold text-primary">Informations personnelles</h2>
          <div className="mt-5 space-y-4">
            <Field label="Genre">
              <div className="flex gap-2">
                {(["M", "F"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => set("gender", g)}
                    className={`flex-1 rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
                      u.gender === g ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-secondary"
                    }`}
                  >
                    {g === "M" ? "Homme" : "Femme"}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Âge" hint={`${u.age} ans`}>
              <input type="range" min={20} max={70} value={u.age} onChange={(e) => set("age", +e.target.value)} className="w-full accent-[var(--color-primary)]" />
            </Field>
            <Field label="Situation familiale">
              <select className={inputCls} value={u.familyStatus} onChange={(e) => set("familyStatus", e.target.value as FamilyStatus)}>
                <option value="Marie">Marié(e)</option>
                <option value="Celibataire">Célibataire</option>
                <option value="Divorce">Divorcé(e)</option>
                <option value="Veuf">Veuf(ve)</option>
                <option value="UnionLibre">Union libre</option>
              </select>
            </Field>
            <Field label="Nombre d'enfants">
              <input type="number" min={0} max={10} className={inputCls} value={u.children} onChange={(e) => set("children", +e.target.value)} />
            </Field>
            <Field label="Niveau d'éducation">
              <select className={inputCls} value={u.education} onChange={(e) => set("education", e.target.value as EducationType)}>
                <option value="Secondaire">Secondaire</option>
                <option value="SecondaireSpe">Secondaire spécialisé</option>
                <option value="SuperieurIncomplet">Supérieur incomplet</option>
                <option value="Superieur">Supérieur</option>
                <option value="DiplomeAcademique">Diplôme académique</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Informations financières */}
        <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-serif text-lg font-semibold text-primary">Informations financières</h2>
          <div className="mt-5 space-y-4">
            <Field label="Revenu annuel total" hint={fmtEuro(u.incomeAnnual)}>
              <input type="number" min={10000} max={500000} step={1000} className={`${inputCls} font-mono`} value={u.incomeAnnual} onChange={(e) => set("incomeAnnual", +e.target.value)} />
            </Field>
            <Field label="Type de revenu">
              <select className={inputCls} value={u.incomeType} onChange={(e) => set("incomeType", e.target.value as IncomeType)}>
                <option value="Salarie">Salarié</option>
                <option value="Fonctionnaire">Fonctionnaire</option>
                <option value="Independant">Indépendant</option>
                <option value="Retraite">Retraité</option>
                <option value="Autre">Autre</option>
              </select>
            </Field>
            <Field label="Catégorie socio-professionnelle">
              <input className={inputCls} value={u.occupation} onChange={(e) => set("occupation", e.target.value)} />
            </Field>
            <Field label="Type d'employeur">
              <input className={inputCls} value={u.organization} onChange={(e) => set("organization", e.target.value)} />
            </Field>
            <Field label="Ancienneté dans l'emploi" hint={`${u.employmentYears} ans`}>
              <input type="range" min={0} max={30} value={u.employmentYears} onChange={(e) => set("employmentYears", +e.target.value)} className="w-full accent-[var(--color-primary)]" />
            </Field>
          </div>
        </section>
      </div>

      {/* Demande de crédit */}
      <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-serif text-lg font-semibold text-primary">Demande de crédit</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Montant du crédit demandé" hint={fmtEuro(u.creditAmount)}>
            <input type="number" min={10000} max={2000000} step={5000} className={`${inputCls} font-mono`} value={u.creditAmount} onChange={(e) => set("creditAmount", +e.target.value)} />
          </Field>
          <Field label="Annuité de remboursement" hint={fmtEuro(u.annuity)}>
            <input type="number" min={1000} max={300000} step={500} className={`${inputCls} font-mono`} value={u.annuity} onChange={(e) => set("annuity", +e.target.value)} />
          </Field>
          <Field label="Durée approximative" hint={`${derived.creditAnnuityRatio.toFixed(1)} ans`}>
            <div className={`${inputCls} bg-muted font-mono text-muted-foreground`}>
              calcul automatique
            </div>
          </Field>
        </div>

        {/* Calculs auto */}
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Metric label="Ratio crédit / revenu" value={derived.creditIncomeRatio.toFixed(2)} pct={Math.min(derived.creditIncomeRatio / 10, 1)} alert={derived.creditIncomeRatio > 6} />
          <Metric label="Ratio annuité / revenu (DTI)" value={fmtPct(derived.annuityIncomeRatio, 1)} pct={Math.min(derived.annuityIncomeRatio / 0.5, 1)} alert={derived.annuityIncomeRatio > 0.35} alertLabel="seuil 35 %" />
          <Metric label="Durée approx." value={`${derived.creditAnnuityRatio.toFixed(1)} ans`} pct={Math.min(derived.creditAnnuityRatio / 35, 1)} />
          <Metric label="Capacité résiduelle / mois" value={fmtEuro(derived.residualMonthly)} pct={Math.min(Math.max(derived.residualMonthly / 4000, 0), 1)} />
        </div>
      </section>

      {/* Historique */}
      <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-primary">Historique externe (bureaux de crédit)</h2>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
              Les variables EXT_SOURCE synthétisent l'historique de
              remboursement auprès d'organismes externes. Identifiées comme
              les déterminants les plus puissants (mémoire, hypothèse H4).
            </p>
          </div>
          <button
            type="button"
            onClick={() => { set("extSource1", 0.5); set("extSource2", 0.5); set("extSource3", 0.5); }}
            className="shrink-0 rounded-sm border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
          >
            Médiane portefeuille
          </button>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {([1, 2, 3] as const).map((i) => {
            const key = `extSource${i}` as const;
            const val = u[key as keyof UserInput] as number;
            return (
              <Field key={i} label={`EXT_SOURCE_${i}`} hint={val.toFixed(2)}>
                <input type="range" min={0} max={1} step={0.01} value={val} onChange={(e) => set(key, +e.target.value as never)} className="w-full accent-[var(--color-primary)]" />
              </Field>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={analyze}
          disabled={loading}
          className="group inline-flex items-center gap-3 rounded-sm bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all hover:bg-primary-glow disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
          {loading ? "Analyse en cours…" : "Analyser la demande de crédit"}
        </button>
      </div>

      {/* Résultats */}
      {shown && (
        <div id="results" className="space-y-8 pt-4">
          {/* Bloc 1 — Décision */}
          <div
            className={`overflow-hidden rounded-md border-l-4 bg-card p-8 shadow-[var(--shadow-elevated)] ${
              decision.color === "success"
                ? "border-l-success"
                : decision.color === "warning"
                ? "border-l-warning"
                : "border-l-destructive"
            }`}
          >
            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr_1fr]">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Décision finale
                </div>
                <div className="mt-2 flex items-center gap-3">
                  {decision.color === "success" && <CheckCircle2 className="h-8 w-8 text-success" />}
                  {decision.color === "warning" && <AlertTriangle className="h-8 w-8 text-warning" />}
                  {decision.color === "destructive" && <XCircle className="h-8 w-8 text-destructive" />}
                  <h2 className="font-serif text-3xl font-semibold text-foreground">{decision.label}</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Verdict établi par le modèle XGBoost (modèle final, AUC 0,756).
                  Seuils prudentiels : &lt; 15 % accordé, 15–25 % zone grise, ≥ 25 % refusé.
                </p>
              </div>
              <div className="border-l border-border pl-6">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Probabilité de défaut
                </div>
                <div className="mt-2 num-fr font-mono text-4xl font-semibold text-primary">
                  {fmtPct(decision.pd, 1)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Niveau : <span className="font-semibold text-foreground">{decision.riskLevel}</span>
                </div>
              </div>
              <div className="border-l border-border pl-6">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Score crédit (FICO)
                </div>
                <div className="mt-2 num-fr font-mono text-4xl font-semibold text-gold">{decision.creditScore}</div>
                <div className="mt-1 text-xs text-muted-foreground">échelle 300 – 850</div>
              </div>
            </div>
          </div>

          {/* Bloc 2 — Comparaison modèles */}
          <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-serif text-lg font-semibold text-primary">Comparaison des trois modèles</h3>
            <div className="mt-4 overflow-hidden rounded-sm border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Modèle</th>
                    <th className="px-4 py-2 text-left">AUC référence</th>
                    <th className="px-4 py-2 text-right">Probabilité de défaut</th>
                    <th className="px-4 py-2 text-right">Décision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { n: "Régression logistique", a: "0,7389", p: preds.logit, final: false },
                    { n: "Random Forest", a: "0,7384", p: preds.rf, final: false },
                    { n: "XGBoost (modèle final)", a: "0,7558", p: preds.xgb, final: true },
                  ].map((r) => {
                    const d = makeDecision(r.p);
                    return (
                      <tr key={r.n} className={r.final ? "bg-success/5" : ""}>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {r.n}
                          {r.final && <span className="ml-2 rounded-sm bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">Final</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.a}</td>
                        <td className="px-4 py-3 text-right font-mono">{fmtPct(r.p, 1)}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${d.color === "success" ? "text-success" : d.color === "warning" ? "text-warning" : "text-destructive"}`}>
                          {d.label}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              La décision finale s'appuie sur XGBoost, identifié comme le modèle
              le plus performant dans l'étude (+1,7 pt d'AUC vs régression logistique).
            </p>
          </div>

          {/* Bloc 3 — SHAP */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-serif text-lg font-semibold text-primary">Pourquoi cette décision ? — Analyse SHAP</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Contributions individuelles des variables au logit du modèle final.
              </p>
              <div className="mt-5">
                <ShapWaterfall contribs={contribs} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-destructive">
                  Facteurs aggravants
                </div>
                <ul className="mt-3 space-y-2.5 text-xs">
                  {positive.map((c) => (
                    <li key={c.key} className="border-l-2 border-destructive/40 pl-3">
                      <div className="font-semibold text-foreground">{c.label} <span className="font-mono text-muted-foreground">({c.value})</span></div>
                      <div className="mt-0.5 text-muted-foreground">{c.explanation}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-success">
                  Facteurs favorables
                </div>
                <ul className="mt-3 space-y-2.5 text-xs">
                  {negative.map((c) => (
                    <li key={c.key} className="border-l-2 border-success/40 pl-3">
                      <div className="font-semibold text-foreground">{c.label} <span className="font-mono text-muted-foreground">({c.value})</span></div>
                      <div className="mt-0.5 text-muted-foreground">{c.explanation}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bloc 4 — Recommandations */}
          <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-gold" />
              <h3 className="font-serif text-lg font-semibold text-primary">Recommandations pour améliorer le dossier</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {recs.map((r, i) => (
                <li key={i} className="flex gap-3 rounded-sm border border-border bg-secondary/40 p-3 text-sm text-foreground">
                  <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloc 6 — Référence mémoire */}
          <div className="rounded-md border-l-4 border-l-gold bg-gold/5 p-5 text-sm text-foreground">
            <div className="font-serif font-semibold text-primary">Référence aux conclusions du mémoire</div>
            <p className="mt-1 text-muted-foreground">
              Cette décision s'appuie sur les conclusions empiriques du mémoire :
              les variables EXT_SOURCE (historique), ANNEES_EMPLOI (stabilité)
              et ANNUITY_INCOME_RATIO (DTI) sont les déterminants les plus
              puissants, conformément aux hypothèses H2, H3 et H4 validées.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, pct, alert, alertLabel }: { label: string; value: string; pct: number; alert?: boolean; alertLabel?: string }) {
  return (
    <div className="rounded-sm border border-border bg-secondary/30 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        {alert && <span className="rounded-sm bg-destructive/15 px-1.5 py-0.5 text-[9px] font-semibold text-destructive">{alertLabel ?? "alerte"}</span>}
      </div>
      <div className="mt-1.5 num-fr font-mono text-base font-semibold text-foreground">{value}</div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${alert ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

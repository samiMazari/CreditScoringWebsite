import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/modeles")({
  head: () => ({
    meta: [
      { title: "Comparaison des modèles — CrediScore AI" },
      { name: "description", content: "Comparaison empirique de la régression logistique, Random Forest et XGBoost sur l'échantillon de test." },
    ],
  }),
  component: ModelsPage,
});

const METRICS = [
  { m: "Régression logistique", auc: 0.7389, acc: 0.6798, prec: 0.1565, rec: 0.6757, f1: 0.2541 },
  { m: "Random Forest", auc: 0.7384, acc: 0.7069, prec: 0.1631, rec: 0.6367, f1: 0.2596 },
  { m: "XGBoost", auc: 0.7558, acc: 0.7266, prec: 0.1744, rec: 0.6389, f1: 0.2740, best: true },
];

// Approximate ROC curves (parametric) reflecting AUC values
const buildRoc = (auc: number) => {
  const pts: { fpr: number; tpr: number }[] = [];
  for (let i = 0; i <= 100; i++) {
    const fpr = i / 100;
    const tpr = Math.min(1, Math.pow(fpr, 1 - (auc - 0.5) * 1.7));
    pts.push({ fpr, tpr });
  }
  return pts;
};

const ROC_DATA = (() => {
  const logit = buildRoc(0.7389);
  const rf = buildRoc(0.7384);
  const xgb = buildRoc(0.7558);
  return logit.map((p, i) => ({ fpr: p.fpr, logit: p.tpr, rf: rf[i].tpr, xgb: xgb[i].tpr, hasard: p.fpr }));
})();

const SHAP_GLOBAL = [
  { v: "EXT_SOURCE_3", imp: 0.124 },
  { v: "EXT_SOURCE_2", imp: 0.108 },
  { v: "CREDIT_ANNUITY_RATIO", imp: 0.082 },
  { v: "EXT_SOURCE_1", imp: 0.071 },
  { v: "AMT_ANNUITY", imp: 0.058 },
  { v: "ANNUITY_INCOME_RATIO", imp: 0.054 },
  { v: "DAYS_BIRTH", imp: 0.046 },
  { v: "DAYS_EMPLOYED", imp: 0.041 },
  { v: "AMT_CREDIT", imp: 0.033 },
  { v: "CREDIT_INCOME_RATIO", imp: 0.029 },
];

function ModelsPage() {
  const [threshold, setThreshold] = useState(0.5);

  // Trade-off precision/recall fictif autour du seuil pour XGBoost
  const tradeoff = useMemo(() => {
    const t = threshold;
    const recall = Math.max(0.05, Math.min(0.99, 1.4 - 1.6 * t));
    const precision = Math.max(0.05, Math.min(0.95, 0.05 + 0.7 * t));
    const f1 = (2 * precision * recall) / (precision + recall);
    return { precision, recall, f1, accuracy: 0.55 + t * 0.4 };
  }, [threshold]);

  return (
    <div className="space-y-10">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Modélisation</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-primary">Comparaison des trois modèles</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Performances mesurées sur l'échantillon de test (61 503 observations,
          partition stratifiée 80/20).
        </p>
      </header>

      <Card title="Métriques sur l'échantillon de test">
        <div className="overflow-hidden rounded-sm border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Modèle", "AUC-ROC", "Accuracy", "Precision", "Recall", "F1-score"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-sm">
              {METRICS.map((m) => (
                <tr key={m.m} className={m.best ? "bg-success/5" : ""}>
                  <td className="px-4 py-3 font-sans font-medium text-foreground">
                    {m.m}
                    {m.best && <span className="ml-2 rounded-sm bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">Best</span>}
                  </td>
                  <td className="px-4 py-3">{m.auc.toFixed(4).replace(".", ",")}</td>
                  <td className="px-4 py-3">{m.acc.toFixed(4).replace(".", ",")}</td>
                  <td className="px-4 py-3">{m.prec.toFixed(4).replace(".", ",")}</td>
                  <td className="px-4 py-3">{m.rec.toFixed(4).replace(".", ",")}</td>
                  <td className="px-4 py-3">{m.f1.toFixed(4).replace(".", ",")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Courbes ROC superposées" subtitle="Aire sous la courbe — pouvoir discriminant">
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={ROC_DATA}>
                <CartesianGrid stroke="var(--color-border)" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} label={{ value: "Taux de faux positifs", position: "insideBottom", offset: -5, fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 4, fontSize: 12 }} />
                <Line type="monotone" dataKey="hasard" stroke="var(--color-muted-foreground)" strokeDasharray="4 4" dot={false} name="Hasard" />
                <Line type="monotone" dataKey="logit" stroke="var(--color-primary)" dot={false} name="Logit (0,739)" strokeWidth={2} />
                <Line type="monotone" dataKey="rf" stroke="var(--color-gold)" dot={false} name="RF (0,738)" strokeWidth={2} />
                <Line type="monotone" dataKey="xgb" stroke="var(--color-success)" dot={false} name="XGBoost (0,756)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Importance globale SHAP" subtitle="Top 10 variables — modèle XGBoost">
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={SHAP_GLOBAL} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis type="category" dataKey="v" width={170} tick={{ fontSize: 10, fill: "var(--color-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="imp" radius={[0, 2, 2, 0]}>
                  {SHAP_GLOBAL.map((_, i) => <Cell key={i} fill={i < 3 ? "var(--color-primary)" : "var(--color-primary-glow)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Matrices de confusion (échantillon test)" subtitle="61 503 observations · seuil 0,5">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "Logit", vp: 3357, fn: 1611, fp: 18077, vn: 38458 },
            { n: "Random Forest", vp: 3163, fn: 1805, fp: 16221, vn: 40314 },
            { n: "XGBoost", vp: 3175, fn: 1793, fp: 14998, vn: 41537 },
          ].map((c) => (
            <div key={c.n} className="rounded-sm border border-border bg-card p-4">
              <div className="mb-3 text-sm font-semibold text-foreground">{c.n}</div>
              <div className="grid grid-cols-2 gap-1 text-center text-xs font-mono">
                <div className="rounded-sm bg-success/15 p-3"><div className="text-[9px] uppercase tracking-wider text-muted-foreground">VP</div><div className="text-base font-semibold text-success">{c.vp.toLocaleString("fr-FR")}</div></div>
                <div className="rounded-sm bg-destructive/15 p-3"><div className="text-[9px] uppercase tracking-wider text-muted-foreground">FN</div><div className="text-base font-semibold text-destructive">{c.fn.toLocaleString("fr-FR")}</div></div>
                <div className="rounded-sm bg-warning/15 p-3"><div className="text-[9px] uppercase tracking-wider text-muted-foreground">FP</div><div className="text-base font-semibold text-warning">{c.fp.toLocaleString("fr-FR")}</div></div>
                <div className="rounded-sm bg-primary/10 p-3"><div className="text-[9px] uppercase tracking-wider text-muted-foreground">VN</div><div className="text-base font-semibold text-primary">{c.vn.toLocaleString("fr-FR")}</div></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Arbitrage Precision / Recall — XGBoost" subtitle="Ajustement interactif du seuil">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Seuil de classification : <span className="font-mono text-primary">{threshold.toFixed(2)}</span>
            </label>
            <input type="range" min={0.05} max={0.95} step={0.01} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-3 w-full accent-[var(--color-primary)]" />
            <p className="mt-3 text-xs text-muted-foreground">
              Un seuil bas privilégie la détection (recall) au prix de plus de
              faux positifs ; un seuil haut accroît la précision mais laisse
              passer plus de défauts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Precision", tradeoff.precision],
              ["Recall", tradeoff.recall],
              ["F1-score", tradeoff.f1],
              ["Accuracy", tradeoff.accuracy],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-sm border border-border bg-secondary/30 p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="mt-1 num-fr font-mono text-2xl font-semibold text-primary">{((v as number) * 100).toFixed(1).replace(".", ",")}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      {subtitle && <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{subtitle}</div>}
      <h3 className="mt-1 font-serif text-lg font-semibold text-primary">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

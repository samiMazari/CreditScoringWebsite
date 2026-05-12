import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/analyses")({
  head: () => ({
    meta: [
      { title: "Analyses statistiques — CrediScore AI" },
      { name: "description", content: "Statistiques descriptives et analyses exploratoires sur 307 511 demandes de crédit." },
    ],
  }),
  component: AnalysesPage,
});

const TARGET_DATA = [
  { name: "Non-défaut (TARGET = 0)", value: 282686, color: "var(--color-primary)" },
  { name: "Défaut (TARGET = 1)", value: 24825, color: "var(--color-destructive)" },
];

const CORR_TOP = [
  { var: "EXT_SOURCE_3", corr: -0.179 },
  { var: "EXT_SOURCE_2", corr: -0.16 },
  { var: "EXT_SOURCE_1", corr: -0.155 },
  { var: "DAYS_BIRTH (âge)", corr: -0.078 },
  { var: "DAYS_EMPLOYED", corr: -0.045 },
  { var: "ANNUITY_INCOME_RATIO", corr: 0.066 },
  { var: "CREDIT_INCOME_RATIO", corr: 0.038 },
  { var: "AMT_ANNUITY", corr: 0.013 },
  { var: "CNT_CHILDREN", corr: 0.019 },
  { var: "AMT_CREDIT", corr: -0.03 },
];

const PROFILS = [
  { t: "Jeune cadre dynamique", age: 28, rev: "50 000 €", anc: "3 ans", pd: "5,8 %" },
  { t: "Famille avec enfants", age: 38, rev: "42 000 €", anc: "8 ans", pd: "7,2 %" },
  { t: "Retraité", age: 67, rev: "26 000 €", anc: "—", pd: "4,1 %" },
  { t: "Travailleur indépendant", age: 44, rev: "35 000 €", anc: "10 ans", pd: "11,4 %" },
];

function AnalysesPage() {
  return (
    <div className="space-y-10">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Section analytique</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-primary">Analyses et statistiques descriptives</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Caractéristiques du portefeuille Home Credit (307 511 observations,
          122 variables d'origine, taux de défaut global de 8,07 %).
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Distribution de la variable TARGET" subtitle="307 511 demandes de prêts">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={TARGET_DATA} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {TARGET_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString("fr-FR")} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 4, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6 text-xs">
            {TARGET_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Statistiques par groupe" subtitle="Moyennes — défaut vs non-défaut">
          <div className="overflow-hidden rounded-sm border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2 text-left">Variable</th><th className="px-3 py-2 text-right">Non-défaut</th><th className="px-3 py-2 text-right">Défaut</th></tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-xs">
                {[
                  ["Âge moyen", "44,1 ans", "40,3 ans"],
                  ["Revenu annuel", "169 077 €", "164 230 €"],
                  ["Montant crédit", "602 648 €", "557 778 €"],
                  ["Annuité", "27 100 €", "26 480 €"],
                  ["EXT_SOURCE_3", "0,536", "0,387"],
                  ["EXT_SOURCE_2", "0,521", "0,409"],
                  ["DTI moyen", "16,9 %", "18,4 %"],
                  ["Ancienneté emploi", "6,5 ans", "4,1 ans"],
                ].map(([k, a, b]) => (
                  <tr key={k}><td className="px-3 py-2 text-foreground">{k}</td><td className="px-3 py-2 text-right">{a}</td><td className="px-3 py-2 text-right text-destructive">{b}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <Card title="Top 10 corrélations avec TARGET" subtitle="Coefficient de Pearson — variables sélectionnées">
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={CORR_TOP} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[-0.2, 0.2]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <YAxis type="category" dataKey="var" width={170} tick={{ fontSize: 11, fill: "var(--color-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="corr" radius={[0, 2, 2, 0]}>
                {CORR_TOP.map((d, i) => <Cell key={i} fill={d.corr < 0 ? "var(--color-success)" : "var(--color-destructive)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section>
        <h2 className="font-serif text-xl font-semibold text-primary">Profils types d'emprunteurs</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PROFILS.map((p) => (
            <div key={p.t} className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="text-sm font-semibold text-foreground">{p.t}</div>
              <dl className="mt-3 space-y-1.5 text-xs">
                {[["Âge moyen", `${p.age} ans`], ["Revenu", p.rev], ["Ancienneté", p.anc], ["PD estimée", p.pd]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono text-foreground">{v}</dd></div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{subtitle}</div>
      <h3 className="mt-1 font-serif text-lg font-semibold text-primary">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

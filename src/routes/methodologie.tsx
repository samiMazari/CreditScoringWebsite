import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/methodologie")({
  head: () => ({
    meta: [
      { title: "Méthodologie — CrediScore AI" },
      { name: "description", content: "Pipeline de traitement, modèles, théorie SHAP et métriques d'évaluation." },
    ],
  }),
  component: MethodPage,
});

const PIPELINE = [
  ["Sélection variables", "16 variables retenues parmi 122 selon la pertinence métier."],
  ["Nettoyage", "Traitement des anomalies (DAYS_EMPLOYED = 365 243), valeurs manquantes."],
  ["Feature engineering", "Création de 4 ratios dérivés (CREDIT_INCOME, ANNUITY_INCOME, CREDIT_ANNUITY, AGE)."],
  ["Encodage one-hot", "Variables catégorielles : 87 → 112 colonnes."],
  ["Standardisation", "Z-score sur les variables continues."],
  ["Partition stratifiée", "80 % entraînement / 20 % test (246 008 / 61 503 obs)."],
  ["Gestion du déséquilibre", "class_weight (logit/RF) et scale_pos_weight = 11,39 (XGBoost)."],
];

const TABS = [
  {
    k: "logit",
    n: "Régression logistique",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p className="font-mono text-xs text-foreground">P(Y=1 | X) = 1 / (1 + exp(−β₀ − Σ βᵢ Xᵢ))</p>
        <p>Modèle de référence en credit scoring depuis Wiginton (1980). Les coefficients s'interprètent en odds ratio (OR = exp(β)).</p>
        <p><strong className="text-foreground">Avantages</strong> : transparence totale, conformité réglementaire (Bâle III, AI Act), justification individuelle des refus.</p>
      </div>
    ),
  },
  {
    k: "rf",
    n: "Random Forest",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>Ensemble d'arbres CART entraînés par bagging avec sous-échantillonnage aléatoire des variables (Breiman, 2001).</p>
        <p className="font-mono text-xs text-foreground">200 arbres · profondeur max 10 · min_samples_leaf 50 · class_weight = balanced</p>
        <p><strong className="text-foreground">Avantages</strong> : robustesse au sur-apprentissage, capture des non-linéarités, importance native des variables.</p>
      </div>
    ),
  },
  {
    k: "xgb",
    n: "XGBoost",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>Gradient boosting régularisé (Chen & Guestrin, 2016). Construction additive séquentielle minimisant une fonction objectif régularisée.</p>
        <p className="font-mono text-xs text-foreground">L(φ) = Σᵢ ℓ(ŷᵢ, yᵢ) + Σₖ Ω(fₖ)</p>
        <p className="font-mono text-xs text-foreground">300 arbres · learning_rate 0,1 · max_depth 6 · scale_pos_weight 11,39</p>
        <p><strong className="text-foreground">Performance</strong> : meilleur AUC (0,756) sur l'échantillon test, +1,7 pt vs régression logistique.</p>
      </div>
    ),
  },
];

function MethodPage() {
  const [tab, setTab] = useState("logit");
  const cur = TABS.find((t) => t.k === tab)!;

  return (
    <div className="space-y-10">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Cadre théorique</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-primary">Méthodologie</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Pipeline de traitement, choix des modèles, fondements théoriques de
          SHAP et métriques d'évaluation retenues.
        </p>
      </header>

      <Card title="Pipeline complet de traitement">
        <ol className="space-y-3">
          {PIPELINE.map(([t, d], i) => (
            <li key={t} className="flex gap-4 rounded-sm border border-border bg-secondary/30 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary font-mono text-xs font-semibold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Présentation des trois modèles">
        <div className="flex gap-2 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.k ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.n}
              {tab === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-gold" />}
            </button>
          ))}
        </div>
        <div className="pt-5">{cur.body}</div>
      </Card>

      <Card title="SHAP — théorie et application">
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Les valeurs de Shapley, issues de la théorie des jeux coopératifs
            (Lloyd Shapley, 1953), distribuent équitablement la contribution
            marginale de chaque variable à la prédiction d'un modèle.
          </p>
          <p className="rounded-sm border border-border bg-secondary/30 p-3 font-mono text-xs text-foreground">
            φᵢ(v) = Σ_S⊆N\{`{i}`} [ |S|! (|N|−|S|−1)! / |N|! ] · [v(S∪{`{i}`}) − v(S)]
          </p>
          <p>
            Lundberg & Lee (2017) ont étendu cette formulation au machine
            learning (SHAP). TreeExplainer offre un calcul exact en temps
            polynomial pour les modèles arborés (XGBoost, RF), assurant les
            propriétés d'additivité, de consistance et de cohérence locale.
          </p>
          <p>
            Cette explicabilité post-hoc satisfait les exigences du RGPD
            (article 22 — droit à explication) et de l'AI Act européen.
          </p>
        </div>
      </Card>

      <Card title="Métriques d'évaluation">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["AUC-ROC", "Probabilité qu'un défaut tiré au hasard reçoive un score plus élevé qu'un non-défaut. Métrique privilégiée car indépendante du seuil et du déséquilibre des classes."],
            ["Accuracy", "Part des prédictions correctes. Trompeuse en présence d'un fort déséquilibre (8 % de défauts)."],
            ["Precision", "Part des positifs prédits qui sont effectivement défaillants. Mesure le coût des faux refus."],
            ["Recall (sensibilité)", "Part des défauts effectivement identifiés. Critique pour minimiser les pertes financières."],
            ["F1-score", "Moyenne harmonique précision/recall — arbitrage équilibré."],
            ["Coût FP vs FN", "Un faux négatif (défaut non détecté) coûte 5 à 10 fois plus qu'un faux positif (refus injustifié) en credit scoring."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-sm border border-border bg-secondary/30 p-4">
              <div className="text-sm font-semibold text-foreground">{t}</div>
              <div className="mt-1 text-xs text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      {subtitle && <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{subtitle}</div>}
      <h2 className="mt-1 font-serif text-xl font-semibold text-primary">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

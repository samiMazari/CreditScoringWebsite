// Logique de scoring crédit — modèles calibrés selon les conclusions empiriques
// du mémoire "Modélisation du score de crédit bancaire" (Mazari, UPEC 2025-2026).
// Coefficients reflétant les hypothèses validées : H2 (stabilité), H3 (DTI),
// H4 (historique externes), conformes aux odds ratios reportés.

export type Gender = "M" | "F";
export type FamilyStatus = "Marie" | "Celibataire" | "Divorce" | "Veuf" | "UnionLibre";
export type EducationType =
  | "Secondaire"
  | "SecondaireSpe"
  | "SuperieurIncomplet"
  | "Superieur"
  | "DiplomeAcademique";
export type IncomeType = "Salarie" | "Independant" | "Fonctionnaire" | "Retraite" | "Autre";

export interface UserInput {
  gender: Gender;
  age: number; // années
  familyStatus: FamilyStatus;
  children: number;
  education: EducationType;
  incomeAnnual: number; // €
  incomeType: IncomeType;
  occupation: string;
  organization: string;
  employmentYears: number;
  creditAmount: number; // €
  annuity: number; // € / an
  extSource1: number; // 0..1
  extSource2: number;
  extSource3: number;
}

export interface DerivedFeatures {
  creditIncomeRatio: number;
  annuityIncomeRatio: number;
  creditAnnuityRatio: number;
  residualMonthly: number;
}

export const calcDerived = (u: UserInput): DerivedFeatures => ({
  creditIncomeRatio: u.creditAmount / Math.max(u.incomeAnnual, 1),
  annuityIncomeRatio: u.annuity / Math.max(u.incomeAnnual, 1),
  creditAnnuityRatio: u.annuity > 0 ? u.creditAmount / u.annuity : 0,
  residualMonthly: (u.incomeAnnual - u.annuity) / 12,
});

const eduScore: Record<EducationType, number> = {
  Secondaire: 0,
  SecondaireSpe: -0.05,
  SuperieurIncomplet: -0.1,
  Superieur: -0.25,
  DiplomeAcademique: -0.4,
};
const incomeTypeScore: Record<IncomeType, number> = {
  Salarie: 0,
  Fonctionnaire: -0.15,
  Independant: 0.18,
  Retraite: -0.05,
  Autre: 0.25,
};

// Contributions linéaires (logit) — cœur de l'explicabilité.
// Centrées autour de valeurs médianes du portefeuille Home Credit.
export interface FeatureContribution {
  key: string;
  label: string;
  value: string;
  contribution: number; // en logit
  direction: "up" | "down";
  explanation: string;
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

export function computeContributions(u: UserInput, d: DerivedFeatures): FeatureContribution[] {
  const c: FeatureContribution[] = [];

  // EXT_SOURCE_3 — H4 fortement validée
  c.push({
    key: "ext3",
    label: "Score externe 3 (historique)",
    value: u.extSource3.toFixed(2),
    contribution: -2.6 * (u.extSource3 - 0.5),
    direction: u.extSource3 > 0.5 ? "down" : "up",
    explanation:
      u.extSource3 >= 0.6
        ? "Historique de remboursement très favorable auprès des bureaux de crédit."
        : "Historique externe inférieur à la moyenne du portefeuille.",
  });
  // EXT_SOURCE_2
  c.push({
    key: "ext2",
    label: "Score externe 2 (historique)",
    value: u.extSource2.toFixed(2),
    contribution: -2.3 * (u.extSource2 - 0.5),
    direction: u.extSource2 > 0.5 ? "down" : "up",
    explanation: "Second indicateur synthétique d'historique de crédit.",
  });
  // EXT_SOURCE_1
  c.push({
    key: "ext1",
    label: "Score externe 1 (historique)",
    value: u.extSource1.toFixed(2),
    contribution: -1.6 * (u.extSource1 - 0.5),
    direction: u.extSource1 > 0.5 ? "down" : "up",
    explanation: "Troisième source d'historique — corrélée aux défauts passés.",
  });
  // ANNUITY_INCOME_RATIO (DTI) — H3
  c.push({
    key: "dti",
    label: "Ratio annuité / revenu (DTI)",
    value: (d.annuityIncomeRatio * 100).toFixed(1) + " %",
    contribution: 2.4 * (d.annuityIncomeRatio - 0.18),
    direction: d.annuityIncomeRatio > 0.18 ? "up" : "down",
    explanation:
      d.annuityIncomeRatio > 0.35
        ? "Endettement supérieur au seuil prudentiel de 35 % — risque accru."
        : "Charge d'endettement maîtrisée sur le revenu annuel.",
  });
  // CREDIT_INCOME_RATIO
  c.push({
    key: "cir",
    label: "Ratio crédit / revenu",
    value: d.creditIncomeRatio.toFixed(2),
    contribution: 0.18 * (d.creditIncomeRatio - 4),
    direction: d.creditIncomeRatio > 4 ? "up" : "down",
    explanation: "Volume de crédit rapporté au revenu annuel total.",
  });
  // CREDIT_ANNUITY_RATIO (durée approx.)
  c.push({
    key: "car",
    label: "Durée approximative (années)",
    value: d.creditAnnuityRatio.toFixed(1),
    contribution: 0.025 * (d.creditAnnuityRatio - 18),
    direction: d.creditAnnuityRatio > 18 ? "up" : "down",
    explanation: "Plus la durée est longue, plus l'incertitude sur le défaut s'accroît.",
  });
  // ANNEES_EMPLOI — H2 validée
  c.push({
    key: "emp",
    label: "Ancienneté professionnelle",
    value: u.employmentYears + " ans",
    contribution: -0.06 * (Math.min(u.employmentYears, 25) - 6),
    direction: u.employmentYears > 6 ? "down" : "up",
    explanation:
      u.employmentYears < 2
        ? "Faible ancienneté — instabilité associée à un risque plus élevé."
        : "Ancienneté supérieure à la médiane, signal positif de stabilité.",
  });
  // AGE
  c.push({
    key: "age",
    label: "Âge",
    value: u.age + " ans",
    contribution: -0.018 * (u.age - 40),
    direction: u.age > 40 ? "down" : "up",
    explanation: "L'âge mûr est un indicateur statistique de stabilité financière.",
  });
  // Education
  c.push({
    key: "edu",
    label: "Niveau d'éducation",
    value: eduLabel(u.education),
    contribution: eduScore[u.education],
    direction: eduScore[u.education] < 0 ? "down" : "up",
    explanation: "Un niveau d'études élevé est corrélé à un revenu plus stable.",
  });
  // Income type
  c.push({
    key: "inc",
    label: "Type de revenu",
    value: incomeLabel(u.incomeType),
    contribution: incomeTypeScore[u.incomeType],
    direction: incomeTypeScore[u.incomeType] < 0 ? "down" : "up",
    explanation: "Statut professionnel — corrélé au profil de risque.",
  });
  // Children
  c.push({
    key: "child",
    label: "Nombre d'enfants",
    value: String(u.children),
    contribution: 0.04 * u.children,
    direction: u.children > 0 ? "up" : "down",
    explanation: "Charges familiales — légèrement corrélées au défaut.",
  });
  // Gender
  c.push({
    key: "gender",
    label: "Genre",
    value: u.gender === "M" ? "Homme" : "Femme",
    contribution: u.gender === "M" ? 0.12 : -0.05,
    direction: u.gender === "M" ? "up" : "down",
    explanation: "Effet observé empiriquement (variable de contrôle).",
  });

  return c;
}

const INTERCEPT = -2.55; // baseline ~ 7-8 % défaut

export interface ModelPrediction {
  logit: number;
  rf: number;
  xgb: number;
}

export function predictModels(contribs: FeatureContribution[]): ModelPrediction {
  const z = INTERCEPT + contribs.reduce((s, c) => s + c.contribution, 0);
  const pLogit = sigmoid(z);
  // RF et XGB : ajustements reflétant les performances comparées du mémoire.
  // RF accuracy supérieure mais AUC quasi-identique au logit ; XGB meilleur séparateur.
  const pRf = sigmoid(z * 1.05 - 0.05);
  const pXgb = sigmoid(z * 1.18 - 0.1);
  return { logit: pLogit, rf: pRf, xgb: pXgb };
}

export type Decision = "ACCORDE" | "ZONE_GRISE" | "REFUSE";

export interface DecisionResult {
  decision: Decision;
  riskLevel: "Faible" | "Modéré" | "Élevé";
  creditScore: number; // 300-850
  pd: number;
  color: "success" | "warning" | "destructive";
  label: string;
}

export function makeDecision(pdXgb: number): DecisionResult {
  let decision: Decision;
  let riskLevel: DecisionResult["riskLevel"];
  let color: DecisionResult["color"];
  let label: string;
  if (pdXgb < 0.15) {
    decision = "ACCORDE";
    riskLevel = "Faible";
    color = "success";
    label = "Crédit accordé";
  } else if (pdXgb < 0.25) {
    decision = "ZONE_GRISE";
    riskLevel = "Modéré";
    color = "warning";
    label = "Demande à étudier";
  } else {
    decision = "REFUSE";
    riskLevel = "Élevé";
    color = "destructive";
    label = "Crédit refusé";
  }
  // Score FICO-like : 850 si PD=0, 300 si PD=1, courbe inversée.
  const creditScore = Math.round(850 - (850 - 300) * Math.pow(pdXgb, 0.55));
  return { decision, riskLevel, creditScore, pd: pdXgb, color, label };
}

export function generateRecommendations(contribs: FeatureContribution[], u: UserInput, d: DerivedFeatures): string[] {
  const recs: string[] = [];
  if (d.annuityIncomeRatio > 0.35) {
    const target = u.incomeAnnual * 0.35;
    recs.push(`Réduire l'annuité sous ${Math.round(target).toLocaleString("fr-FR")} € pour passer sous le seuil prudentiel DTI de 35 %.`);
  }
  if (u.employmentYears < 2) {
    recs.push("Attendre 1 à 2 années supplémentaires d'ancienneté professionnelle pour renforcer le signal de stabilité.");
  }
  if (u.extSource3 < 0.4 || u.extSource2 < 0.4) {
    recs.push("Consolider l'historique de remboursement (régularité des échéances en cours, suppression des incidents passés).");
  }
  if (d.creditIncomeRatio > 6) {
    recs.push("Diminuer le montant emprunté ou apporter un co-emprunteur / garantie pour rapprocher le ratio crédit/revenu de la médiane (≈ 4×).");
  }
  if (d.creditAnnuityRatio > 25) {
    recs.push("Raccourcir la durée du prêt afin de réduire l'incertitude long-terme.");
  }
  if (recs.length === 0) {
    recs.push("Profil aligné avec les conditions standard d'octroi — aucun levier d'amélioration majeur identifié.");
  }
  return recs;
}

export function eduLabel(e: EducationType): string {
  return {
    Secondaire: "Secondaire",
    SecondaireSpe: "Secondaire spécialisé",
    SuperieurIncomplet: "Supérieur incomplet",
    Superieur: "Supérieur",
    DiplomeAcademique: "Diplôme académique",
  }[e];
}
export function incomeLabel(i: IncomeType): string {
  return { Salarie: "Salarié", Fonctionnaire: "Fonctionnaire", Independant: "Indépendant", Retraite: "Retraité", Autre: "Autre" }[i];
}

export const PRESETS: Record<string, UserInput> = {
  cadre: {
    gender: "M", age: 28, familyStatus: "Celibataire", children: 0, education: "Superieur",
    incomeAnnual: 50000, incomeType: "Salarie", occupation: "Cadre", organization: "Business Entity Type 3",
    employmentYears: 3, creditAmount: 200000, annuity: 14400,
    extSource1: 0.55, extSource2: 0.62, extSource3: 0.58,
  },
  retraite: {
    gender: "F", age: 65, familyStatus: "Marie", children: 0, education: "Secondaire",
    incomeAnnual: 25000, incomeType: "Retraite", occupation: "Retraité", organization: "XNA",
    employmentYears: 0, creditAmount: 60000, annuity: 5400,
    extSource1: 0.6, extSource2: 0.65, extSource3: 0.7,
  },
  independant: {
    gender: "M", age: 42, familyStatus: "Marie", children: 2, education: "SuperieurIncomplet",
    incomeAnnual: 35000, incomeType: "Independant", occupation: "Self-employed", organization: "Self-employed",
    employmentYears: 8, creditAmount: 150000, annuity: 11000,
    extSource1: 0.45, extSource2: 0.4, extSource3: 0.42,
  },
  etudiant: {
    gender: "F", age: 22, familyStatus: "Celibataire", children: 0, education: "SuperieurIncomplet",
    incomeAnnual: 15000, incomeType: "Autre", occupation: "Low-skill Laborers", organization: "Other",
    employmentYears: 0, creditAmount: 50000, annuity: 4800,
    extSource1: 0.3, extSource2: 0.35, extSource3: 0.25,
  },
};

export const fmtEuro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const fmtNum = (n: number, d = 0) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

export const fmtPct = (n: number, d = 1) =>
  new Intl.NumberFormat("fr-FR", { style: "percent", minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

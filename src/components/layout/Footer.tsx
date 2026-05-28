export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <div className="font-serif text-base font-semibold text-primary">Sami-CrediScore</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Plateforme académique d'évaluation du risque de crédit fondée sur les
            travaux empiriques du mémoire de recherche UPEC 2025-2026.
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground">Conformité</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>RGPD — aucune donnée stockée</li>
            <li>Conforme aux principes Bâle III</li>
            <li>Explicabilité AI Act (SHAP)</li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground">Avertissement</div>
          <p className="mt-3 text-xs text-muted-foreground">
            Outil éducatif et de démonstration. Les résultats ne constituent pas
            une décision bancaire réelle.
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground">Institution</div>
          <p className="mt-3 text-xs text-muted-foreground">
            Université Paris-Est Créteil
            <br />
            Master MASERATI — GP IA
            <br />
            Année 2025-2026
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-6 py-4 text-[11px] text-muted-foreground md:flex-row">
          <span>© 2026 CrediScore AI — Mohamed Sami Mazari. Licence MIT.</span>
          <span className="font-mono">build · v1.0.0 · stable</span>
        </div>
      </div>
    </footer>
  );
}

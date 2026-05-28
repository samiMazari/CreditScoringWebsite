#  CrediScore AI

**Plateforme Web de Scoring de Crédit Bancaire**

Application de modélisation du risque de crédit combinant approches économétrique et Machine Learning.

---

##  Vue d'ensemble

**CrediScore AI** est une application web interactive permettant d'évaluer le risque de défaut de crédit d'un demandeur d'emprunt. Elle implémente un modèle XGBoost entraîné sur 307 511 observations réelles.

###  Caractéristiques

- ✅ Interface web intuitive et responsive
- ✅ Prédictions en < 1 seconde
- ✅ Explications SHAP conformes RGPD
- ✅ Modèle performant (AUC = 0.7558)
- ✅ Pipeline complet de nettoyage et feature engineering
- ✅ Déployable en production bancaire

---

##  Architecture Technique

### Stack

```
Frontend:  React 18 + Tailwind CSS
Backend:   Python Flask + XGBoost
Deploy:    Vercel (frontend) + Heroku (backend)
```

### Workflow

```
Formulaire Web
     ↓
Prétraitement (Z-score, encodage, imputation)
     ↓
Modèle XGBoost
     ↓
SHAP Explanations
     ↓
Résultats (Score + Probabilité + Explications)
```

---

##  Performance du Modèle

### Résultats XGBoost

| Métrique | Valeur |
|----------|--------|
| **AUC-ROC** | **0.7558** |
| Accuracy | 72.66% |
| Precision | 17.44% |
| Recall | 63.89% |
| F1-Score | 0.2740 |

### Hypothèses Validées

| Hypothèse | Énoncé | Résultat |
|-----------|--------|----------|
| H1 | Revenu réduit défaut | 
| H2 | Emploi réduit défaut | 
| H3 | Endettement ↑ défaut | 
| H4 | Historique prédit | 
| H5 | ML > Logit | 

---

## Installation & Utilisation

### Accès en ligne (recommandé)

```
https://creditscoring.lovable.app/
```

Aucune installation requise !

### Installation locale

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py  # Port 5000

# Frontend
cd frontend
npm install
npm start      # Port 3000
```

### Workflow utilisateur

1. Remplir le formulaire avec données client
2. Cliquer "Calculer Score"
3. Consulter résultats et explications SHAP
4. Prendre décision

---

## 📈 Top 8 Variables Prédictives (SHAP)

1. **EXT_SOURCE_3** - Score bureau crédit #3 
2. **EXT_SOURCE_2** - Score bureau crédit #2 
3. **CREDIT_ANNUITY_RATIO** - Durée approx. prêt
4. **EXT_SOURCE_1** - Score bureau crédit #1
5. **AMT_ANNUITY** - Mensualité
6. **ANNEES_EMPLOI** - Ancienneté emploi
7. **ANNUITY_INCOME_RATIO** - DTI (ratio endettement)
8. **AGE_ANS** - Âge

 **Interprétation** : L'historique crédit (EXT_SOURCE) est le déterminant dominant.

---

##  Conformité Réglementaire

### Bâle III
Modèle PD robuste et validé pour exigences capital.

### IFRS 9
Estimation fiable de probabilité défaut pour provisionnement.

### RGPD (2016/679)
✅ Explainability via SHAP  
✅ Droit d'accès aux données  
✅ Droit de rectification  

### AI Act (2024)
✅ Classification : Credit scoring = HIGH RISK  
✅ Documentation complète  
✅ Monitoring en production  
✅ Transparence utilisateur  

---

##  Structure du Projet

```
crediscore-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.jsx
│   │   │   ├── Results.jsx
│   │   │   └── SHAPVisualization.jsx
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── app.py
│   ├── models/
│   │   └── xgboost_final.joblib
│   ├── preprocessing.py
│   ├── predict.py
│   ├── shap_explain.py
│   └── requirements.txt
├── notebooks/
│   ├── 01_EDA.ipynb
│   ├── 02_Data_Cleaning.ipynb
│   ├── 03_Feature_Engineering.ipynb
│   ├── 04_Modeling.ipynb
│   └── 05_SHAP_Analysis.ipynb
└── README.md
```

---

##  Données d'Entraînement

**Home Credit Default Risk** (Kaggle 2018)

- Observations: 307,511
- Variables: 122
- Taux défaut: 8.07%
- Couverture: Europe de l'Est, Asie, Amérique du Nord

### Prétraitement

- ✅ Nettoyage des anomalies
- ✅ Feature Engineering (4 variables dérivées)
- ✅ Encodage one-hot
- ✅ Normalisation Z-score
- ✅ Partition 80/20 train/test stratifiée

---

##  Cas d'Usage

### Pour analyste crédit
Scorer rapidement les demandes de crédit avec explications.

### Pour risk manager
Monitorer et valider la performance du modèle.

### Pour compliance
Générer explication automatique de chaque décision (RGPD).

### Pour client
Comprendre pourquoi sa demande est approuvée/refusée.

---

## Limitations

### Modèle
- Défaut est partiellement aléatoire (~50% imprévisible)
- Pseudo-R² = 0.087 (normal en credit scoring, benchmark 5-15%)
- Données historiques (Kaggle 2018)

### Opérationnel
- Ne pas dépendre du modèle seul (vérifier manuellement)
- Monitoring régulier requis
- Recalibration annuelle recommandée

---

##  Validation

### Tests unitaires
```python
def test_xgboost_prediction():
    X_test = load_test_data()
    pred = model.predict_proba(X_test)
    assert (pred >= 0).all() and (pred <= 1).all()
```

### Performance validation
- Données test: 61,503 observations
- AUC test vs train: quasi-identique (pas de surapprentissage)
- Stabilité: résultats cohérents

---

## Déploiement

### Vercel (Frontend)
```bash
vercel deploy
```

### Heroku (Backend)
```bash
heroku create crediscore-api
git push heroku main
```

### Docker (optionnel)
```bash
docker build -t crediscore-ai .
docker run -p 5000:5000 crediscore-ai
```

---

## Contribution

Les pull requests sont bienvenues !

```bash
git checkout -b feature/ma-feature
git commit -m "Add my feature"
git push origin feature/ma-feature
```

---

## Licence

MIT License - Libre d'utiliser, modifier et distribuer.

---

## Citation

```
@thesis{mazari2025,
  author = {Mohamed Sami Mazari},
  title = {CrediScore AI: A Machine Learning Platform for Credit Risk Modeling},
  school = {Université Paris-Est Créteil},
  year = {2025},
  note = {Master 1 Économie Appliquée IA}
}
```

---

## Auteur

**Mohamed Sami Mazari**
- Master 1 Économie Appliquée IA, UPEC
- Email: mazari.mohamedsami@edu.univ-pec.fr
- GitHub: [@MazariSami](https://github.com/MazariSami)

**Encadrant**: Monsieur Sylvain Cherayron

---

## Support

- 📧 **Email**: mazari.mohamedsami@edu.univ-pec.fr
- 🐛 **Issues**: [GitHub Issues](https://github.com/MazariSami/crediscore-ai/issues)
- 📚 **Documentation**: [Lire le README.tex](https://github.com/MazariSami/crediscore-ai)

---

## Conclusion

**CrediScore AI** est une solution **production-ready** de credit scoring combinant rigueur académique et applicabilité bancaire réelle.

Elle démontre que théorie économique et machine learning moderne peuvent être intégrés pour créer une solution **performante, explicable et conforme à la régulation**.

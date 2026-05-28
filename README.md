<div align="center">

# 📊 CrediScore AI

### Plateforme Web de Scoring de Crédit Bancaire

*Application de modélisation du risque de crédit combinant approche économétrique et Machine Learning*

[![Live Demo](https://img.shields.io/badge/🌐_Demo-Live-brightgreen?style=for-the-badge)](https://creditscoring.lovable.app/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-Model-orange?style=for-the-badge)](https://xgboost.readthedocs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![AUC](https://img.shields.io/badge/AUC--ROC-0.7558-success?style=for-the-badge)]()

</div>

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Caractéristiques](#-caractéristiques)
- [Architecture Technique](#-architecture-technique)
- [Performance du Modèle](#-performance-du-modèle)
- [Top 8 Variables SHAP](#-top-8-variables-prédictives-shap)
- [Installation & Utilisation](#-installation--utilisation)
- [Structure du Projet](#-structure-du-projet)
- [Données d'Entraînement](#-données-dentraînement)
- [Conformité Réglementaire](#-conformité-réglementaire)
- [Cas d'Usage](#-cas-dusage)
- [Limitations](#-limitations)
- [Déploiement](#-déploiement)
- [Validation](#-validation)
- [Contribution](#-contribution)
- [Citation](#-citation)
- [Auteur](#-auteur)

---

## 🔍 Vue d'ensemble

**CrediScore AI** est une application web interactive permettant d'évaluer le **risque de défaut de crédit** d'un demandeur d'emprunt. Elle implémente un modèle **XGBoost** entraîné sur **307 511 observations réelles** issues du dataset *Home Credit Default Risk* (Kaggle 2018).

> Le projet démontre que **théorie économique** et **machine learning moderne** peuvent être intégrés pour créer une solution performante, explicable et conforme à la réglementation bancaire.

---

## ✅ Caractéristiques

| Fonctionnalité | Détail |
|---|---|
| 🖥️ Interface web | Intuitive et responsive |
| ⚡ Vitesse | Prédictions en < 1 seconde |
| 🔍 Explicabilité | Explications SHAP conformes RGPD |
| 📈 Performance | AUC-ROC = 0.7558 |
| 🔧 Pipeline | Nettoyage + Feature Engineering complet |
| 🏦 Production | Déployable en environnement bancaire réel |

---

## 🏗️ Architecture Technique

### Stack

| Couche | Technologies |
|---|---|
| **Frontend** | React 18 + Tailwind CSS |
| **Backend** | Python Flask + XGBoost |
| **Déploiement** | Vercel (frontend) + Heroku (backend) |
| **Explicabilité** | SHAP (SHapley Additive exPlanations) |

### Workflow de prédiction

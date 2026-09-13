# mariob — Sovereign PRD Specification Pack

> Directive IA : Ce README est le contrat de conception pour le projet mariob. Il définit l'architecture, les modules, la vision UI/UX et les règles de câblage. Toute décision technique doit s'y conformer.

---

## 🧭 Vision Métier

Jeu Tetris 2D

---

## 🧱 Modules Architecturaux (10)

1. **Canvas Arcade Phaser (2D Néon)** : Rendu réactif grand écran.
2. **Interface React HUD Overlay** : Affichage dynamique du Score, des Vies et du Niveau.
3. **Synthétiseur Audio ZzFX** : Générateur procédural de bruitages 8-bit.
4. **Câblage Métier & HMR** : Persistance via `window.gameAPI`.
5. **Certification GateRunner** : Homologation Grade GOLD.

---

## 🎨 Directives UI/UX & Design System

- **Palette** : Mode Sombre Néon (#090d16, #38bdf8, #818cf8, #10b981).
- **Moteur Canvas** : Auto-fit responsive (`Phaser.Scale.FIT`).
- **Contrôles** : Clavier (Flèches/ZQSD) et Souris.

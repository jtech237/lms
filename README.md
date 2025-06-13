


# LMS - Learning Management System

Projet complet réalisé avec **Next.js** (App Router, TypeScript), destiné à apprendre en profondeur toutes les facettes de l'écosystème Next.js et des outils modernes du développement web.

## 🚀 Stack principale

- Next.js 14+
- TypeScript
- ESLint (avec configuration de base Next.js)
- Prettier (géré via extension VSCode)
- GitHub Actions (CI de base)
- Tailwind CSS (sera ajouté plus tard)
- Shadcn UI (prévu)

## ⚙️ Démarrage local

```bash
git clone https://github.com/jtech237/lms.git
cd lms
npm install
npm run dev
````

L’application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🧪 Scripts utiles

```bash
npm run dev         # Lancer le serveur de dev
npm run lint        # Vérifier les erreurs ESLint
npm run type-check  # Vérifier les types TypeScript
npm run build       # Construire l'app pour la prod
```

## 📝 Conventions

* Formatage du code via **Prettier** (géré par l'extension VSCode).
* Linting automatisé avec ESLint (intégré à Next.js).
* Chaque nouvelle fonctionnalité est développée dans une branche `feature/*` ou `fix/*`.
* Une Pull Request est soumise avant tout merge vers `main`.

## 📦 Configuration

Créer un fichier `.env` localement à partir de ce template :

```bash
cp .env.example .env
```

Le fichier `.env.example` contient toutes les variables nécessaires, sans valeurs sensibles.

## ✅ Intégration Continue (CI)

* Chaque PR déclenche un pipeline GitHub Actions qui vérifie :

  * l'installation des dépendances
  * le lint (`npm run lint`)
  * les erreurs de types (`npm run type-check`)
  * la compilation (`npm run build`)

## 📄 À venir

* Authentification sécurisée (NextAuth)
* Base de données via Prisma
* API REST / GraphQL
* Upload de fichiers
* Tableau de bord admin
* Paiements / Suivi d'élèves


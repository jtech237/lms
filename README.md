# LMS - Learning Management System

Projet pédagogique pour apprendre Next.js (App Router, TypeScript) et Prisma + PostgreSQL, avec un workflow incrémental.

## 🚀 Stack principale

- Next.js 14+ (App Router) en TypeScript
- ESLint (config Next.js) + format via Prettier en VSCode
- Prisma ORM avec PostgreSQL en dev/prod
- GitHub Actions pour CI (lint, type-check, build, migrations)
- Tailwind CSS, shadcn/ui, etc. (à venir)

## 📥 Prérequis

- Node.js 18+
- PostgreSQL local ou Docker (pour dev)
- VSCode (avec extension Prettier si tu souhaites le format automatique)
- Git

## 🔧 Installation & setup initial

1. Cloner le repo :

    ```shell
       git clone https://github.com/jtech237/lms.git
       cd lms
    ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Copier le fichier d’environnements :

   ```bash
   cp .env.example .env
   ```

   Puis remplir `.env` avec ta chaîne `DATABASE_URL`, par ex. :

   ```
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/lms_dev"
   ```

   Assure-toi que l’utilisateur `<user>` a les droits sur la base et le schéma `public` (cf. section Prisma).

4. Générer Prisma Client et appliquer la migration initiale :

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

    * Si tu rencontres une erreur de permission sur le schéma, connecte-toi en superuser Postgres et fais :

      ```sql
      ALTER DATABASE lms_dev OWNER TO <user>;
      GRANT ALL ON SCHEMA public TO <user>;
      ```
    * Une fois les droits réglés, relance la commande.

5. (Optionnel) Lancer le seed pour remplir des données factices :

   ```bash
   npx prisma db seed
   ```

   Cela créera des utilisateurs (étudiants, enseignants), quelques cours, leçons et inscriptions.

6. Lancer l’app en dev :

   ```bash
   npm run dev
   ```

   Par défaut sur [http://localhost:3000](http://localhost:3000).

## 🔒 Authentification

Le système d'authentification utilise Auth.js avec:

- **Credential Provider** pour l'authentification email/mot de passe
- **RBAC** (Role-Based Access Control) avec rôles STUDENT/TEACHER/ADMIN
- **Bcryptjs** pour le hashage sécurisé des mots de passe
- **Middleware** pour la protection des routes

### 🔧 Installation

- Installer les dépendances :
   ```bash
  npm install next-auth@beta bcryptjs
  npm install @types/bcryptjs --save-dev # optional
  # Add Shadcn/ui components
  npx shadcn/ui@latest add form label card checkbox sonner button
   ```
- Variables d’environnement (`.env.example`) :
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<une-clé-longue>"
   DATABASE_URL="postgresql://<user>:<pwd>@localhost:5432/lms_dev"
   ```

### 🔑 Flow

1. Inscription
    * POST [/api/auth/register](http://localhost:3000/auth/register)
    * Valide `name`, `email`, `password` via **Zod**
    * Hash du mot de passe (bcryptjs)
    * Création User en base
2. Connexion
    * Page [/auth/login](http://localhost:3000/auth/login) avec `signIn('credentials')`
    * NextAuth `CredentialsProvider` :
        * Vérifie email/password avec Prisma
        * Stocke `id` & `role` dans JWT
3. Session
    * `session.strategy = 'jwt'`
    * Callbacks :
        * `jwt` : on ajoute `token.id`, `token.role`
        * `session` : on peuple s`ession.user.id`, `session.user.role`
4. Protection des routes
    * `src/middleware.ts` :
        * redirige non-auth sur `/dashboard/*`
        * contrôle de rôle pour `/dashboard/teacher` et `/dashboard/admin`

### 🛠️ Endpoints

* POST /api/auth/register
* POST /api/auth/get-user
* /api/auth/*.js (NextAuth handler)

### ⚙️ UI

* LoginForm : React Hook Form + Zod + toast
* RegisterForm : React Hook Form + Zod + toast

## 📦 Scripts utiles

* `npm run dev` : démarre le serveur Next.js en mode dev.
* `npm run lint` : exécute ESLint sur le code.
* `npm run type-check` : tsc sans émettre, vérifie les types.
* `npm run build` : build Next.js pour prod.
* `npm run start` : démarre le build en prod.
* `npx prisma generate` : génère Prisma Client.
* `npx prisma migrate dev --name <desc>` : crée/applique une nouvelle migration en dev.
* `npx prisma migrate reset` : réinitialise la base en dev (attention, supprime les données).
* `npx prisma db seed` : exécute le script de seed défini dans `package.json`.

## 🗂️ Structure importante

* `prisma/schema.prisma` : schéma Prisma avec modèles User, Course, Lesson, Enrollment, Role enum.
* `prisma/migrations/` : dossier généré par `prisma migrate dev` (ne pas supprimer).
* `prisma/seeds/index.ts` : script de seed (données factices).
* `src/generated/prisma/` : Prisma Client généré (ignored in Git).
* `pages/` ou `app/` : code Next.js (selon App Router).
* `.env.example` : variables nécessaires, sans valeurs sensibles.
* `.eslintignore` / `eslint.config.js` : ignorer `src/generated/prisma`.

## 📄 À venir

* Authentification sécurisée (NextAuth)
* Base de données via Prisma
* API REST / GraphQL
* Upload de fichiers
* Tableau de bord admin
* Paiements / Suivi d'élèves


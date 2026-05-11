# 🎓 Find Your Training

Plateforme de mise en relation entre formateurs qualifiés et institutions éducatives.

## 🚀 Technologies

| Côté | Technologie |
|---|---|
| Frontend | React.js + Vite + TailwindCSS |
| Backend | Node.js + Express.js |
| Base de données | PostgreSQL |
| Authentification | JWT + bcryptjs |

---

## 📋 Prérequis

- Node.js v18+
- PostgreSQL v14+
- npm

---

## ⚙️ Installation

### 1. Cloner le projet

git clone https://github.com/ton-username/find_your_training.git
cd find_your_training

### 2. Configurer le Backend

cd server
npm install

Créer le fichier `.env` dans `server/` :

DB_HOST=ton_localhost
DB_PORT=ton_port_bdd
DB_NAME=find_training
DB_USER=ton_user
DB_PASSWORD=ton_password
JWT_SECRET=ton_secret_jwt
PORT=ton_port_du_server

Créer la base de données :

sudo -u postgres psql

CREATE DATABASE find_training;
CREATE USER ton_user WITH PASSWORD 'ton_password';
GRANT ALL PRIVILEGES ON DATABASE find_training TO ton_user;
\c find_training
ALTER SCHEMA public OWNER TO ton_user;
\q

Lancer les migrations :

node config/migration.js

Démarrer le serveur :

npm run dev


### 3. Configurer le Frontend

cd ../client
npm install
npm run dev

---

## 👥 Rôles & Accès

| Rôle | Accès |
|---|---|
| **Formateur** | Profil, candidatures, formations, messagerie |
| **Institution** | Profil, offres, candidatures reçues, messagerie |
| **Admin** | Gestion globale, statistiques |

---

## 🔑 Compte Admin par défaut

```
Email    : admin@findtraining.com
Password : password
```

---

## 📡 Endpoints API

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/auth/me | Utilisateur connecté |
| GET/PUT | /api/formateurs/:id | Profil formateur |
| GET | /api/formateurs | Recherche formateurs |
| GET/PUT | /api/institutions/:id | Profil institution |
| POST/GET | /api/offres | Créer/lister offres |
| GET | /api/offres/search | Recherche offres |
| POST | /api/candidatures | Postuler |
| GET | /api/candidatures/mes-candidatures | Ses candidatures |
| GET | /api/candidatures/offre/:id | Candidatures d'une offre |
| PUT | /api/candidatures/:id | Accepter/refuser |
| POST/GET | /api/formations | Créer/lister formations |
| POST | /api/messages | Envoyer un message |
| GET | /api/messages/conversations | Ses conversations |
| GET | /api/admin/stats | Statistiques globales |
| GET | /api/admin/users | Tous les utilisateurs |

---

## 📁 Structure du projet

find_your_training/
├── client/                 → Frontend React
│   └── src/
│       ├── api/            → Centralisation des requêtes
│       ├── components/     → Composants réutilisables
│       ├── context/        → AuthContext
│       └── pages/          → Pages par rôle
└── server/                 → Backend Node.js
    ├── config/             → BDD + migrations
    ├── controllers/        → Logique métier
    ├── middlewares/        → Auth + rôles
    └── routes/             → Définition des routes

---

## 👨‍💻 Auteur

Développé dans le cadre d'un projet de Pre-stage — 2026
Lawal Rafiou
```

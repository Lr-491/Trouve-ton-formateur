# React + Vite

Structure du projet React

client/src/
├── api/
│   └── api.js          → configuration api
├── context/
│   └── AuthContext.jsx   → gestion utilisateur connecté
├── pages/
├── Home.jsx                    → page d'accueil publique
├── auth/
│   ├── Login.jsx
│   └── Register.jsx
├── formateur/
│   ├── Dashboard.jsx
│   └── Profil.jsx
├── institution/
│   ├── Dashboard.jsx
│   └── Profil.jsx
├── recherche/
│   ├── RechercheFormateurs.jsx → chercher des formateurs
│   └── RechercheOffres.jsx    → chercher des offres
├── offres/
│   └── OffreDetail.jsx        → détail d'une offre
├── formations/
│   └── FormationDetail.jsx    → détail d'une formation
└── admin/
|    └── Dashboard.jsx
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── App.jsx
└── main.jsx


mkdir -p src/api src/context src/components src/pages/auth src/pages/formateur src/pages/institution src/pages/admin
mkdir -p src/pages/recherche src/pages/offres src/pages/formations

touch  src/pages/auth/Login.jsx  src/pages/formateur/Dashboard.jsx src/pages/institution/Dashboard.jsx src/pages/admin/Dashbaord.jsx
touch  src/pages/auth/Register.jsx  src/pages/formateur/Profil.jsx src/pages/institution/Profil.jsx src/pages/admin/Profil.jsx

touch src/pages/recherche/RechercheFormateurs.jsx src/pages/offres/OffreDeail.jsx src/pages/formations/FormationDetail.jsx
touch src/pages/recherche/RechercheOffres.jsx 
const pool = require('./db.js');

const createTables = async () => {
  try {
    await pool.query(`

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('formateur', 'institution', 'admin')),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS formateurs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        nom VARCHAR(100),
        prenom VARCHAR(100),
        bio TEXT,
        competences TEXT[],
        localisation VARCHAR(100),
        disponible BOOLEAN DEFAULT true,
        photo VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS institutions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        nom VARCHAR(255),
        secteur VARCHAR(100),
        description TEXT,
        localisation VARCHAR(100),
        site_web VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS offres (
        id SERIAL PRIMARY KEY,
        institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
        titre VARCHAR(255),
        description TEXT,
        competences TEXT[],
        localisation VARCHAR(100),
        statut VARCHAR(50) DEFAULT 'ouverte' CHECK (statut IN ('ouverte', 'fermée', 'pourvue')),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS candidatures (
        id SERIAL PRIMARY KEY,
        formateur_id INTEGER REFERENCES formateurs(id) ON DELETE CASCADE,
        offre_id INTEGER REFERENCES offres(id) ON DELETE CASCADE,
        message TEXT,
        statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'acceptée', 'refusée')),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS formations (
        id SERIAL PRIMARY KEY,
        formateur_id INTEGER REFERENCES formateurs(id) ON DELETE CASCADE,
        titre VARCHAR(255),
        description TEXT,
        duree INTEGER,
        prix DECIMAL(10,2),
        niveau VARCHAR(50) CHECK (niveau IN ('débutant', 'intermédiaire', 'avancé')),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        expediteur_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        destinataire_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        contenu TEXT,
        lu BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        auteur_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cible_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        note INTEGER CHECK (note BETWEEN 1 AND 5),
        commentaire TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

    `);

    console.log('Tables créées avec succès');
    process.exit(0);

  } catch (error) {
    console.error('Erreur lors de la création des tables :', error);
    process.exit(1);
  }
};

createTables();


// ALTER TABLE users ADD COLUMN profil_complet BOOLEAN DEFAULT false;
// \q
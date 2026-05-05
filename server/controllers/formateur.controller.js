/**
 * Controller des formateurs
 * Gère la consultation et la modification des profils formateurs
 */

const pool = require('../config/db');

/**
 * Récupérer le profil d'un formateur
 * @route GET /api/formateurs/:id
 */
const getProfil = async (req, res) => {
  try {
    const { id } = req.params;

    // Jointure entre formateurs et users pour avoir toutes les infos
    const result = await pool.query(
      `SELECT 
        formateurs.id,
        formateurs.nom,
        formateurs.prenom,
        formateurs.bio,
        formateurs.competences,
        formateurs.localisation,
        formateurs.disponible,
        formateurs.photo,
        users.email,
        users.profil_complet
      FROM formateurs
      JOIN users ON formateurs.user_id = users.id
      WHERE formateurs.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Formateur introuvable' });
    }

    res.status(200).json({ profil: result.rows[0] });

  } catch (error) {
    console.error('Erreur getProfil formateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Modifier le profil d'un formateur
 * @route PUT /api/formateurs/:id
 */
const updateProfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, bio, competences, localisation, disponible, photo } = req.body;

    // Vérifier que le formateur modifie bien son propre profil
    const formateur = await pool.query(
      'SELECT * FROM formateurs WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (formateur.rows.length === 0) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    // Mettre à jour le profil
    const updated = await pool.query(
      `UPDATE formateurs SET
        nom = COALESCE($1, nom),
        prenom = COALESCE($2, prenom),
        bio = COALESCE($3, bio),
        competences = COALESCE($4, competences),
        localisation = COALESCE($5, localisation),
        disponible = COALESCE($6, disponible),
        photo = COALESCE($7, photo)
      WHERE id = $8
      RETURNING *`,
      [nom, prenom, bio, competences, localisation, disponible, photo, id]
    );

    // Marquer le profil comme complété dans users
    await pool.query(
      'UPDATE users SET profil_complet = true WHERE id = $1',
      [req.user.id]
    );

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      profil: updated.rows[0]
    });

  } catch (error) {
    console.error('Erreur updateProfil formateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Rechercher des formateurs avec filtres
 * @route GET /api/formateurs?competence=...&localisation=...&disponible=...
 */

const searchFormateurs = async (req, res) => {
  try {
    const { competence, localisation, disponible } = req.query;

    // Construction dynamique de la requête
    let query = `
        SELECT 
        formateurs.id,
        formateurs.nom,
        formateurs.prenom,
        formateurs.bio,
        formateurs.competences,
        formateurs.localisation,
        formateurs.photo,

        users.email

        FROM formateurs
        JOIN users ON formateurs.user_id = users.id
        WHERE 1=1
    `;

    // 1=1 est une astuce pour pouvoir enchaîner les AND dynamiquement
    let params = [];
    let index = 1;

    if(competence){
        query += ` AND $${index} = ANY(formateurs.competences)`;
        params.push(competence)
        index++
    }

    if (localisation) {
        query += ` AND LOWER(formateurs.localisation) LIKE LOWER($${index})`;
        params.push(`%${localisation}%`);
        index++;
    }

    if (disponible !== undefined) {
        query += ` AND formateurs.disponible = $${index}`;
        param.push(disponible === 'true');
        index++;
    }

    query += ` ORDER BY formateurs.id DESC`;

    const result = await pool.query(query, params);

    res.status(200).json({
        total: result.rows.length,
        formateur: result.rows
    })
  } catch (error) {
    console.error('Erreur searchFormateurs :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }  
};

module.exports = { getProfil, updateProfil, searchFormateurs };
/**
 * Controller des formations
 * Gère la création, consultation, modification et suppression des formations
 */

const pool = require('../config/db');
const { param } = require('../routes/formateur.routes');

/**
 * Créer une formation
 * @route POST /api/formations
 */

const createFormation = async (req, res) => {
    try {
        const { titre, description, duree, prix, niveau } = req.body;

        if(!titre || !description) return res.status(400).json({ message : 'Titre et description obligatoire' });

        // Récuperer le formateur_id depuis le user connecté
        const formateur = await pool.query(
            `SELECT id FROM formateurs WHERE user_id = $1`,
            [req.user.id]
        );

        if (formateur.rows.length === 0) {
            return res.status(404).json({ message: 'Formateur introuvable' });
        }


        const formateur_id = formateur.rows[0].id;

        const newFormation = await pool.query(
            `INSERT INTO formations (formateur_id, titre, description, duree, prix, niveau) VALUES
            ($1, $2, $3, $4, $5, $6)`,
            [formateur_id, titre, description, duree, prix, niveau]
        );

        res.status(201).json({
            message: 'Formation créée avec succès',
            formation: newFormation.rows[0]
        })
    } catch (error) {
        console.error('Erreur createFormation :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * Lister toutes les formations
 * @route GET /api/formations
 */

const getAllFormations = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT formations.*,
             formateurs.nom,
             formateurs.prenom,
             formateurs.localisation

             FROM formations
             JOIN formateurs ON formations.formateur_id = formateurs.id

             ORDER BY created_at DESC
            `
        );

        res.status(200).json({ formations: result.rows });
    } catch (error) {
        console.error('Erreur getAllormation :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * Voir une formation appartenant à un formateur
 * @route Get /api/formation/:id
 */

const getFormation = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await pool.query(
        `SELECT formations.*,
        formateurs.nom,
        formateurs.prenom,
        formateurs.bio,
        formateurs.localisation,
        users.email,

        FROM formations
        JOIN formateurs ON formations.formateur_id = formateurs.id
        JOIN users ON  formateurs.user_id = users.id

        WHERE formations.id = $1

        `, [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }


    res.status(200).json({ formation : result.rows[0]});
  } catch (error) {
     console.error('Erreur getFormation :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }  
};

/**
 * Modifer une formation (formateur)
 * @route PUT /api/formateur/:id
 */

const updateFormation = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, duree, prix, niveau } = req.body;

    // Vérifier que le formateur est bien propriétaire de la formation
    const formateur = await pool.query(
        `SELECT id FROM formateurs WHERE user_id = $1`,
        [req.user.id]
    );

    const formateur_id = formateur.rows[0].id;

    const formation = await pool.query(
        `SELECT * FROM formations WHERE id = $1 AND formateur_id $ $2`,
        [id, formateur_id]
    );

    if (formation.rows.length === 0) return res.status(403).json({ message: 'Accès non authorisé'});

    const updated = await pool.query(
        ` UPDATE formations SET
            titre = COALESCE($1, titre),
            description = COALESCE($2, description),
            duree = COALESCE($3, duree),
            prix = COALESCE($4, prix),
            niveau = COALESCE($5, niveau)
        WHERE id = $6
        RETURNING *`,
        [titre, description, duree, prix, niveau, id]
    );
    res.status(200).json({
      message: 'Formation mise à jour avec succès',
      formation: updated.rows[0]
    });
  } catch (error) {
    console.error("Erreur updateFormation :", error);
    res.status(500).json({ message : 'Erreur server'});
    
  }  
};


/**
 * Supprimer une formation
 * @route DELETE /api/formations/:id
 */
const deleteFormation = async (req, res) => {
  try {
    const { id } = req.params;

    const formateur = await pool.query(
      'SELECT id FROM formateurs WHERE user_id = $1',
      [req.user.id]
    );

    const formation = await pool.query(
      'SELECT * FROM formations WHERE id = $1 AND formateur_id = $2',
      [id, formateur.rows[0].id]
    );

    if (formation.rows.length === 0) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await pool.query('DELETE FROM formations WHERE id = $1', [id]);

    res.status(200).json({ message: 'Formation supprimée avec succès' });

  } catch (error) {
    console.error('Erreur deleteFormation :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};




module.exports = { createFormation, deleteFormation, getAllFormations, getFormation, updateFormation };
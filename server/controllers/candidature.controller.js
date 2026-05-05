/**
 * Controller des candidatures
 * Gère les candidatures des formateurs aux offres
 */

const pool = require('../config/db');

/**
 * Postuler à une offre
 * @route POST /api/candidatures
 */
const postuler = async (req, res) => {
  try {
    const { offre_id, message } = req.body;

    if (!offre_id) {
      return res.status(400).json({ message: 'offre_id obligatoire' });
    }

    // Récupérer le formateur_id
    const formateur = await pool.query(
      'SELECT id FROM formateurs WHERE user_id = $1',
      [req.user.id]
    );

    if (formateur.rows.length === 0) {
      return res.status(404).json({ message: 'Formateur introuvable' });
    }

    const formateur_id = formateur.rows[0].id;

    // Vérifier que le formateur n'a pas déjà postulé
    const dejaPostule = await pool.query(
      'SELECT * FROM candidatures WHERE formateur_id = $1 AND offre_id = $2',
      [formateur_id, offre_id]
    );

    if (dejaPostule.rows.length > 0) {
      return res.status(400).json({ message: 'Vous avez déjà postulé à cette offre' });
    }

    const newCandidature = await pool.query(
      `INSERT INTO candidatures (formateur_id, offre_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [formateur_id, offre_id, message]
    );

    res.status(201).json({
      message: 'Candidature envoyée avec succès',
      candidature: newCandidature.rows[0]
    });

  } catch (error) {
    console.error('Erreur postuler :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Voir les candidatures d'une offre
 * @route GET /api/candidatures/offre/:offre_id
 */
const getCandidaturesOffre = async (req, res) => {
  try {
    const { offre_id } = req.params;

    const result = await pool.query(
      `SELECT
        candidatures.*,
        formateurs.nom,
        formateurs.prenom,
        formateurs.competences,
        formateurs.localisation,
        users.email
       FROM candidatures
       JOIN formateurs ON candidatures.formateur_id = formateurs.id
       JOIN users ON formateurs.user_id = users.id
       WHERE candidatures.offre_id = $1
       ORDER BY candidatures.created_at DESC`,
      [offre_id]
    );

    res.status(200).json({ candidatures: result.rows });

  } catch (error) {
    console.error('Erreur getCandidaturesOffre :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Voir ses propres candidatures
 * @route GET /api/candidatures/mes-candidatures
 */
const getMesCandidatures = async (req, res) => {
  try {
    const formateur = await pool.query(
      'SELECT id FROM formateurs WHERE user_id = $1',
      [req.user.id]
    );

    const result = await pool.query(
      `SELECT
        candidatures.*,
        offres.titre AS offre_titre,
        offres.localisation AS offre_localisation,
        institutions.nom AS institution_nom
       FROM candidatures
       JOIN offres ON candidatures.offre_id = offres.id
       JOIN institutions ON offres.institution_id = institutions.id
       WHERE candidatures.formateur_id = $1
       ORDER BY candidatures.created_at DESC`,
      [formateur.rows[0].id]
    );

    res.status(200).json({ candidatures: result.rows });

  } catch (error) {
    console.error('Erreur getMesCandidatures :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Accepter ou refuser une candidature
 * @route PUT /api/candidatures/:id
 */
const updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['acceptée', 'refusée'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const updated = await pool.query(
      `UPDATE candidatures SET statut = $1 WHERE id = $2 RETURNING *`,
      [statut, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Candidature introuvable' });
    }

    res.status(200).json({
      message: `Candidature ${statut} avec succès`,
      candidature: updated.rows[0]
    });

  } catch (error) {
    console.error('Erreur updateStatut :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { postuler, getCandidaturesOffre, getMesCandidatures, updateStatut };
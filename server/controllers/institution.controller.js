/**
 * Controller des institutions
 * Gère la consultation et la modification des profils institutions
 */

const pool = require('../config/db');

/**
 * Récupérer le profil d'une institution
 * @route GET /api/institutions/:id
 */
const getProfil = async (req, res) => {
  try {
    const { id } = req.params;

    // Jointure entre institutions et users
    const result = await pool.query(
      `SELECT
        institutions.id,
        institutions.nom,
        institutions.secteur,
        institutions.description,
        institutions.localisation,
        institutions.site_web,
        users.email,
        users.profil_complet
      FROM institutions
      JOIN users ON institutions.user_id = users.id
      WHERE institutions.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Institution introuvable' });
    }

    res.status(200).json({ profil: result.rows[0] });

  } catch (error) {
    console.error('Erreur getProfil institution :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Modifier le profil d'une institution
 * @route PUT /api/institutions/:id
 */
const updateProfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, secteur, description, localisation, site_web } = req.body;

    // Vérifier que l'institution modifie bien son propre profil
    const institution = await pool.query(
      'SELECT * FROM institutions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (institution.rows.length === 0) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    // Mettre à jour le profil
    const updated = await pool.query(
      `UPDATE institutions SET
        nom = COALESCE($1, nom),
        secteur = COALESCE($2, secteur),
        description = COALESCE($3, description),
        localisation = COALESCE($4, localisation),
        site_web = COALESCE($5, site_web)
      WHERE id = $6
      RETURNING *`,
      [nom, secteur, description, localisation, site_web, id]
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
    console.error('Erreur updateProfil institution :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { getProfil, updateProfil };
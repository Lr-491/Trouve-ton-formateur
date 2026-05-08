/**
 * Controller du panel admin
 * Gère la modération et les statistiques de la plateforme
 */

const pool = require('../config/db');

/**
 * Lister tous les utilisateurs
 * @route GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, role, profil_complet, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      total: result.rows.length,
      users: result.rows
    });

  } catch (error) {
    console.error('Erreur getAllUsers :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Supprimer un utilisateur
 * @route DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression de son propre compte
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

  } catch (error) {
    console.error('Erreur deleteUser :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Changer le rôle d'un utilisateur
 * @route PUT /api/admin/users/:id/role
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['formateur', 'institution', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const updated = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
      [role, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({
      message: 'Rôle mis à jour avec succès',
      user: updated.rows[0]
    });

  } catch (error) {
    console.error('Erreur updateRole :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Lister toutes les offres (admin)
 * @route GET /api/admin/offres
 */
const getAllOffres = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        offres.*,
        institutions.nom AS institution_nom
       FROM offres
       JOIN institutions ON offres.institution_id = institutions.id
       ORDER BY offres.created_at DESC`
    );

    res.status(200).json({
      total: result.rows.length,
      offres: result.rows
    });

  } catch (error) {
    console.error('Erreur getAllOffres admin :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Supprimer une offre
 * @route DELETE /api/admin/offres/:id
 */
const deleteOffre = async (req, res) => {
  try {
    const { id } = req.params;

    const offre = await pool.query('SELECT * FROM offres WHERE id = $1', [id]);

    if (offre.rows.length === 0) {
      return res.status(404).json({ message: 'Offre introuvable' });
    }

    await pool.query('DELETE FROM offres WHERE id = $1', [id]);

    res.status(200).json({ message: 'Offre supprimée avec succès' });

  } catch (error) {
    console.error('Erreur deleteOffre admin :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Statistiques globales
 * @route GET /api/admin/stats
 */
const getStats = async (req, res) => {
  try {
    const [users, formateurs, institutions, offres, candidatures, formations, messages, evaluations] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM formateurs'),
      pool.query('SELECT COUNT(*) FROM institutions'),
      pool.query('SELECT COUNT(*) FROM offres'),
      pool.query('SELECT COUNT(*) FROM candidatures'),
      pool.query('SELECT COUNT(*) FROM formations'),
      pool.query('SELECT COUNT(*) FROM messages'),
      pool.query('SELECT COUNT(*) FROM evaluations'),
    ]);

    // Statistiques des offres par statut
    const offresParStatut = await pool.query(
      `SELECT statut, COUNT(*) FROM offres GROUP BY statut`
    );

    // Statistiques des candidatures par statut
    const candidaturesParStatut = await pool.query(
      `SELECT statut, COUNT(*) FROM candidatures GROUP BY statut`
    );

    res.status(200).json({
      stats: {
        total_users: parseInt(users.rows[0].count),
        total_formateurs: parseInt(formateurs.rows[0].count),
        total_institutions: parseInt(institutions.rows[0].count),
        total_offres: parseInt(offres.rows[0].count),
        total_candidatures: parseInt(candidatures.rows[0].count),
        total_formations: parseInt(formations.rows[0].count),
        total_messages: parseInt(messages.rows[0].count),
        total_evaluations: parseInt(evaluations.rows[0].count),
        offres_par_statut: offresParStatut.rows,
        candidatures_par_statut: candidaturesParStatut.rows
      }
    });

  } catch (error) {
    console.error('Erreur getStats :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { getAllUsers, deleteUser, updateRole, getAllOffres, deleteOffre, getStats };
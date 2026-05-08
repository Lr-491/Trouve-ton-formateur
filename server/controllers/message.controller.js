/**
 * Controller des messages
 * Gère l'envoi et la consultation des messages entre utilisateurs
 */

const pool = require('../config/db');

/**
 * Envoyer un message
 * @route POST /api/messages
 */
const envoyerMessage = async (req, res) => {
  try {
    const { destinataire_id, contenu } = req.body;

    if (!destinataire_id || !contenu) {
      return res.status(400).json({ message: 'Destinataire et contenu obligatoires' });
    }

    // Vérifier que le destinataire existe
    const destinataire = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [destinataire_id]
    );

    if (destinataire.rows.length === 0) {
      return res.status(404).json({ message: 'Destinataire introuvable' });
    }

    // Vérifier qu'on ne s'envoie pas un message à soi-même
    if (req.user.id === parseInt(destinataire_id)) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous envoyer un message' });
    }

    const newMessage = await pool.query(
      `INSERT INTO messages (expediteur_id, destinataire_id, contenu)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, destinataire_id, contenu]
    );

    res.status(201).json({
      message: 'Message envoyé avec succès',
      data: newMessage.rows[0]
    });

  } catch (error) {
    console.error('Erreur envoyerMessage :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Récupérer la conversation avec un utilisateur
 * @route GET /api/messages/:user_id
 */
const getConversation = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Marquer les messages reçus comme lus
    await pool.query(
      `UPDATE messages SET lu = true
       WHERE expediteur_id = $1 AND destinataire_id = $2 AND lu = false`,
      [user_id, req.user.id]
    );

    // Récupérer tous les messages entre les deux utilisateurs
    const result = await pool.query(
      `SELECT
        messages.*,
        exp.email AS expediteur_email,
        dest.email AS destinataire_email
       FROM messages
       JOIN users exp ON messages.expediteur_id = exp.id
       JOIN users dest ON messages.destinataire_id = dest.id
       WHERE (messages.expediteur_id = $1 AND messages.destinataire_id = $2)
          OR (messages.expediteur_id = $2 AND messages.destinataire_id = $1)
       ORDER BY messages.created_at ASC`,
      [req.user.id, user_id]
    );

    res.status(200).json({ messages: result.rows });

  } catch (error) {
    console.error('Erreur getConversation :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Récupérer toutes les conversations
 * @route GET /api/messages/conversations
 */
const getConversations = async (req, res) => {
  try {
    // Récupérer le dernier message de chaque conversation
    const result = await pool.query(
      `SELECT DISTINCT ON (other_user)
        CASE
          WHEN messages.expediteur_id = $1 THEN messages.destinataire_id
          ELSE messages.expediteur_id
        END AS other_user,
        users.email AS other_user_email,
        messages.contenu AS dernier_message,
        messages.created_at,
        messages.lu
       FROM messages
       JOIN users ON users.id = CASE
          WHEN messages.expediteur_id = $1 THEN messages.destinataire_id
          ELSE messages.expediteur_id
       END
       WHERE messages.expediteur_id = $1 OR messages.destinataire_id = $1
       ORDER BY other_user, messages.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({ conversations: result.rows });

  } catch (error) {
    console.error('Erreur getConversations :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { envoyerMessage, getConversation, getConversations };
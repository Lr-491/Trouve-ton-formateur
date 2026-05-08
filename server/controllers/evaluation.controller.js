/**
 * Controller des évaluations
 * Gère les notes et avis entre utilisateurs
 */

const pool = require('../config/db');



/**
 * Noter un utilisateur
 * @route POST /api/evaluations
 */
const noterUtilisateur = async (req, res) => {
    try {
        const { cible_id, note, commentaire } = req.body;

        // Vérification des champs
        if(!cible_id || !note) return res.status(400).json({ message: 'Cible et note obligatoire' });

        // Vérifier que la note est entre 1 et 5
        if(note < 1 || note > 5 ) return res.status(400).json({ message: 'La note doit être entre 1 et 5' });

        // Vérifier qu'on ne se note pas soi-même
        if(req.user.id === parseInt(cible_id)) return res.status(400).json({ message: 'Vous ne pouvez pas vous noter vous-même' });

        // Vérifier que la cible existe
        const cible = await pool.query(
            'SELECT id FROM users WHERE id = $1',
            [cible_id]
        );

        if(cible.rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvvable' });

        // Vérifier qu'on n'as pas déjà noté cet utilisateur
        const dejaNote = await pool.query(
            'SELECT * FROM evaluations WHERE auteur_id = $1 AND cible_id = $2',
            [req.user.id, cible_id]
        );

        if(dejaNote.rows.length > 0) return res.status(400).json({ message: 'Vous avez déjà noté cet utilisateur' });

        const newEvaluation = await pool.query(
            `INSERT INTO evaluations (auteur_id, cible_id, note, commentaire)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [req.user.id, cible_id, note, commentaire]
        );

        res.status(201).json({
            message: 'Evaluation envoyée avec succès',
            evaluation: newEvaluation.rows[0]
        });
    } catch (error) {
        console.error('Erreur noterUtilisateur :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
        
    }      
};

/**
 * Voir les évaluations d'un utilisateur
 * @route GET /api/evaluations
 */
const getEvaluations = async (req, res) => {
    try {
        const { user_id } = req.params;

        const result = await pool.query(
            `SELECT 
               evaluations.*,
               users.email AS auteur_email,
               users.role AS auteur_role
            FROM evaluations
            JOIN users ON evaluations.auteur_id = users.id
            WHERE evaluations.cible_id = $1
            ORDER BY evaluations.created_at DESC`,
            [user_id]
        );

        // Calculer la moyenne des notes
        const moyenne = result.rows.length > 0 ? (result.rows.reduce((sum, e) => sum + e.note, 0) / result.rows.length).toFixed(1) : null;

        res.status(200).json({
            total: result.rows.length,
            moyenne,
            evaluations: result.rows
        })
    } catch (error) {
        console.error('Erreur getEvaluations :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' })
        
    }  
};


module.exports = { noterUtilisateur, getEvaluations }
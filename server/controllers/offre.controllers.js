/**
 * Controller des offres
 * Gère la création, consultation, modification et suppression des offres
 */


const pool =require('../config/db');


/**
 * Créer une offre
 * @route POST /api/offres
 */


const createOffre = async (req, res) => {
    try {
        const { titre, description, competences, localisation } = req.body;

        if (!titre || !description)  return res.status(400).json({ message : "Le Titre et la description sont obligatoire"});

        // Récuperation de l'institution_id depuis le user connecté
        const institution = await pool.query(
            `
            SELECT id FROM institutions WHERE user_id = $1`,
            [req.user.id]
        );

        if ( institution.rows.length === 0 ) return res.status(404).json({ message: 'institution introuvalbe' });

        const institution_id = institution.rows[0].id;

        // Création du nouvelle offre
        const newOffre = await pool.query(
            `INSERT INTO offres (institution_id, titre, description, competences, localisation) VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *`,
            [institution_id, titre, description, competences, localisation]
        );

        res.status(201).json({
            message: "Votre offre a été crée avec succès",
            offre: newOffre.rows[0]
        })
    } catch (error) {
         console.error('Erreur createOffre :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * *Lire tous les offres
 * @route GET /api/offres
 */

const getAllOffres = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT offres.*,
            institutions.nom AS institution_nom,
            institutions.localisation AS institution_localisation

            FROM offres
            JOIN institutions ON offres.institution_id = institutions.id
            WHERE offres.statut = 'ouverte'

            ORDER BY offres.created_at DESC
            `
        );

        res.status(200).json({ offres : result.rows });
    } catch (error) {
         console.error('Erreur getAllOffre :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * *Lire un seul offre par son id
 * @route GET /api/offres/:id
 */

const getOffre = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT offres.*,
            institutions.nom AS institution_nom,
            institutions.secteur AS institution_secteur,
            institutions.description AS instiution_description,
            institutions.localisation AS institution_localisation,
            institutions.site_web AS institution_site_web

            FROM offres
            JOIN institutions ON offres.institution_id = institutions.id

            WHERE offres.id = $1
            `
            ,[id]
        );

        if(result.rows.length === 0) return res.status(404).json({ message : 'Offre introuvable' });

        res.status(200).json({ offre : result.rows[0] });
    } catch (error) {
            console.error('Erreur getOffre :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * MODIFIER UNE OFFRE Crée
 * @route PUT /api/offres/:id
 */

const updateOffre = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, description, competences, localisation, statut } = req.body;

        // Vérifier bien que l'institution est bien le propriétaire de l'offre
        const institution = await pool.query(
            `SELECT id FROM institutions WHERE user_id = $1`,
            [req.user.id]
        );

        const offre = await pool.query(
            `SELECT * FROM offres WHERE id = $1 AND institution_id = $2`,
            [id, institution.rows[0].id]
        );

        if (offre.rows.length === 0 ) return res.status(403).json({ message : 'Accès non authorisée'});


        // Modification si aucune erreur
        const updated = await pool.query(
            `UPDATE offres SET
            titre = COALESCE($1, titre),
            description = COALESCE($2, description),
            competences = COALESCE($3, competences),
            localisation = COALESCE($4, localisation),
            statut = COALESCE($5, statut)
            WHERE id = $6
            RETURNING *`,
            [titre, description, competences, localisation, statut, id]
        );

        res.status(202).json({
            message: 'Offre mise à jour avec succès',
            offre: updated.rows[0]

        });
    } catch (error) {
        console.error('Erreur updateOffre :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * SUPPRIMER UNE OFFRE
 * @route DELETE /api/offres/:id
 */

const deleteOffre = async (req, res) => {
    try {
        const { id } = req.params;

        const institution = await pool.query(
            `SELECT id FROM institutions WHERE user_id = $1`,
            [req.user.id]
        );

        const offre = await pool.query(
            `SELECT * FROM offres WHERE id = $1 AND institution_id = $2`,
            [id, institution.rows[0].id]
        );

        if ( offre.rows.length === 0) return res.status(403).json({ message: 'Action non authorisée'});

        await pool.query(
            `DELETE FROM offres WHERE id = $1`,[id]
        );

        res.status(200).json({
            message : 'Offre supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur deleteOffre :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


module.exports = { createOffre, getAllOffres, getOffre, updateOffre, deleteOffre}
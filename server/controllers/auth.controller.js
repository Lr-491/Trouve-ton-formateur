/**
 * Controller d'authentification
 * Gère l'inscription et la connexion des utilisateurs
 */

const pool = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/**
 * Inscription
 * @route POST /api/auth/register
 */

const register = async (req, res)  => {
    try {
        const { email, password, role } = req.body;

        // Vérification des champs 
        if ( !email || !password || !role) return res.status(400).json({ message: 'Tous les champs sont obligatoires' });

        // Vérification du role de l'utilisateur si valide
        if (!['formateur', 'institution'].includes(role)) {
            return res.status(400).json({ message: 'Role non valide' });
        }

        // Vérification de l'existancede l'email
        const userExiste = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExiste.rows.length > 0 ) {
            return res.status(400).json({ message : "Email est déjà utilisé"});
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion du nouveau utilisateur dans la BDD
        const newUser = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, role]
        );

        const user = newUser.rows[0];

        // Crée le profile selon le role
        if (role === 'formateur') {
            await pool.query('INSERT INTO formateurs (user_id) VALUES ($1)', [user.id]);
        } else if (role === 'institution') {
            await pool.query('INSERT INTO institutions (user_id) VALUES ($1)', [user.id]);
        }

        res.status(201).json({ message : "Inscription Réussie"});
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message : "Erreur interne du serveur" });
    }
}


/**
 * Connexion
 * @route POST /api/auth/login
 */

const login = async (req, res)  => {
    try {
        const { email, password } = req.body;

        // Vérification des champs
        if (!email, !password) return res.status(400).json({ message : "Email et mot de passe obligatoire"});


        // Chercher l'utilisateur
        const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message : "Utilisateur introuvable"});
        }

        const user = result.rows[0];

        // Vérification du mot de passe hashé
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message : "Mot de pass incorrect" });

        // Génération du token avec JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
        );

        // Retourner le token sans le mot de passe
        res.status(200).json({
            message : "Connexion reussie",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}

/**
 * Récupérer l'utlisateur connecté
 * @route GET /api/auth/me
 */

const me = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Token valide',
            user: req.user
        });
    } catch (error) {
        console.error('Erreur me :', error);
        res.status(500).json({ message : "Erreur interne du serveur"});
    }
}


module.exports = { register,login, me };
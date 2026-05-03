/**
 * Middlewares d'authentification
 * verifyToken → vérifie que le token JWT est valide
 * verifyRole  → vérifie que l'utilisateur a le bon rôle
 */

const jwt = require('jsonwebtoken');

/**
 * Vérifie le token JWT
 */

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];                              //Récupere le header de la requête
    const token = authHeader && authHeader.split(' ')[1];                        //Récupere le token(Bearer <token>)


    if(!token) return res.status(401).json({ message : "Token Manquant"});

    try {
        
        const decode =  jwt.verify(token, process.env.JWT_SECRET);              // Decode du token
        req.user = decode;                                                      
        next();
    } catch (error) {
        console.error("Erreur token :", error);
        return res.status(401).json({ message: 'Token Invalide' + error });
        
    }
};


/**
 * Vérifie le rôle de l'utilisateur
 * @param  {...string} roles - rôles autorisés
 */

const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé"});
        }
        next();
    };
};



module.exports = { verifyToken,verifyRole };
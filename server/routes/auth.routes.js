/**
 * Routes d'authentification
 * POST /api/auth/register → inscription
 * POST /api/auth/login    → connexion
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');

router.post('/register', authController.register);
router.post('/login', authController.login);


// Route proteger
router.get('/me', verifyToken ,authController.me);



// Exportation de toutes les routes
module.exports = router;
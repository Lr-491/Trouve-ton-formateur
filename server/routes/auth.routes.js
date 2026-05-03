/**
 * Routes d'authentification
 * POST /api/auth/register → inscription
 * POST /api/auth/login    → connexion
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
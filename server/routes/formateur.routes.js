/**
 * Routes des formateurs
 * GET    /api/formateurs/:id  → voir un profil
 * PUT    /api/formateurs/:id  → modifier son profil
 */

const express = require('express');
const router = express.Router();
const formateurController = require('../controllers/formateur.controller.js');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware.js');

// Voir un profil formateur (public)
router.get('/:id', formateurController.getProfil);

// Recherche de formateurs (public)
router.get('/', formateurController.searchFormateurs);

// Modifier son profil (protégé)
router.put('/:id', verifyToken, verifyRole('formateur'), formateurController.updateProfil);

module.exports = router;
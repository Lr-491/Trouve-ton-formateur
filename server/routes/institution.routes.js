/**
 * Routes des institutions
 * GET    /api/institutions/:id  → voir un profil
 * PUT    /api/institutions/:id  → modifier son profil
 */

const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');
const { verifyToken, verifyRole} = require('../middleware/auth.middleware.js');


// Voir un profile institution (public)
router.get('/:id', institutionController.getProfil);


// Modifier son profile
router.put('/:id', verifyToken, verifyRole('institution'), institutionController.updateProfil);




module.exports = router;
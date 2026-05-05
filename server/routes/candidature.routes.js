/**
 * Routes des candidatures
 * POST   /api/candidatures                      → postuler
 * GET    /api/candidatures/offre/:offre_id      → candidatures d'une offre
 * GET    /api/candidatures/mes-candidatures     → ses candidatures
 * PUT    /api/candidatures/:id                  → accepter/refuser
 */

const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidature.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

// Postuler à une offre (formateur)
router.post('/', verifyToken, verifyRole('formateur'), candidatureController.postuler);

// Voir les candidatures d'une offre (institution)
router.get('/offre/:offre_id', verifyToken, verifyRole('institution'), candidatureController.getCandidaturesOffre);

// Voir ses propres candidatures (formateur)
router.get('/mes-candidatures', verifyToken, verifyRole('formateur'), candidatureController.getMesCandidatures);

// Accepter ou refuser une candidature (institution)
router.put('/:id', verifyToken, verifyRole('institution'), candidatureController.updateStatut);

module.exports = router;
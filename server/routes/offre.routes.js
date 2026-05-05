/**
 * Routes des offres
 * POST   /api/offres      → créer une offre
 * GET    /api/offres      → lister toutes les offres
 * GET    /api/offres/:id  → voir une offre
 * PUT    /api/offres/:id  → modifier une offre
 * DELETE /api/offres/:id  → supprimer une offre
 */


const express = require('express');
const router = express.Router();
const offreController = require('../controllers/offre.controllers');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');


// Routes publiques

router.get('/', offreController.getAllOffres);
// Recherche d'offres (public)
router.get('/search', offreController.searchOffres);
router.get('/:id', offreController.getOffre);

// Routes protégeés institutions
router.post('/', verifyToken, verifyRole('institution'), offreController.createOffre);
router.put('/:id', verifyToken, verifyRole('institution'), offreController.updateOffre);
router.delete('/:id', verifyToken, verifyRole('institution'), offreController.deleteOffre);



module.exports = router;





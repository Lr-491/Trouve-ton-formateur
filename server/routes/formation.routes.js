/**
 * Routes des formations
 * POST   /api/formations      → créer une formation
 * GET    /api/formations      → lister toutes les formations
 * GET    /api/formations/:id  → voir une formation
 * PUT    /api/formations/:id  → modifier une formation
 * DELETE /api/formations/:id  → supprimer une formation
 */

const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formation.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

// Routes publiques
router.get('/', formationController.getAllFormations);
router.get('/:id', formationController.getFormation);

// Routes protégées formateur
router.post('/', verifyToken, verifyRole('formateur'), formationController.createFormation);
router.put('/:id', verifyToken, verifyRole('formateur'), formationController.updateFormation);
router.delete('/:id', verifyToken, verifyRole('formateur'), formationController.deleteFormation);

module.exports = router;
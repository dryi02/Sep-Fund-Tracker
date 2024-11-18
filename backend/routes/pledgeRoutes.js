import express from 'express';
import pledgeController from '../controllers/pledgeController.js'; // Ensure you use the .js extension

const router = express.Router();

// Route to create a new pledge
router.post('/', pledgeController.createPledge);

// Route to get all pledges
router.get('/', pledgeController.getPledges);

// Route to get a pledge by ID
router.get('/:id', pledgeController.getPledgeById);

// Route to update a pledge by ID
router.put('/:id', pledgeController.updatePledge);

// Route to delete a pledge by ID
router.delete('/:id', pledgeController.deletePledge);

// Route to get all pledges for a specific class
router.get('/classes/:id/pledges', pledgeController.getPledgesForClass);

export default router;

import express from 'express';
import { generateSummary, generateTags } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All AI endpoints are private (require JWT token)
router.use(protect);

router.post('/summary', generateSummary);
router.post('/tags', generateTags);

export default router;

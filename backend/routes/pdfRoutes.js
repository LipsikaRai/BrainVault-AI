import express from 'express';
import {
  getPdfs,
  createPdf,
  updatePdf,
  deletePdf,
} from '../controllers/pdfController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPdf } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protect all PDF routes
router.use(protect);

// Standard CRUD endpoints for PDFs
router.route('/')
  .get(getPdfs)
  .post(uploadPdf.single('pdf'), createPdf);

router.route('/:id')
  .put(uploadPdf.single('pdf'), updatePdf)
  .delete(deletePdf);

export default router;

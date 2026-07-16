import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Pdf from '../models/Pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to delete a physical file from the uploads directory
const deletePhysicalFile = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const fileName = fileUrl.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Error deleting physical file at ${fileUrl}:`, error);
  }
};

// @desc    Get all PDFs for logged-in user
// @route   GET /api/pdfs
// @access  Private
export const getPdfs = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    // Search query helper
    const { search } = req.query;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { notes: searchRegex },
      ];
    }

    const pdfs = await Pdf.find(filter).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: pdfs.length,
      data: pdfs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload a new PDF
// @route   POST /api/pdfs
// @access  Private
export const createPdf = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('Please upload a PDF file'));
    }

    const { title, category, notes, color } = req.body;

    // Use original file name as fallback title
    const finalTitle = title ? title.trim() : req.file.originalname;

    const fileUrl = `/uploads/${req.file.filename}`;

    const pdf = await Pdf.create({
      user: req.user._id,
      title: finalTitle,
      category: category ? category.trim() : 'General',
      notes: notes ? notes.trim() : '',
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      color: color || '#8b5cf6',
    });

    res.status(201).json({
      success: true,
      data: pdf,
    });
  } catch (error) {
    // If database creation fails, delete physical file to prevent orphan files
    if (req.file) {
      deletePhysicalFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

// @desc    Update PDF metadata or replace PDF file
// @route   PUT /api/pdfs/:id
// @access  Private
export const updatePdf = async (req, res, next) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      if (req.file) {
        deletePhysicalFile(`/uploads/${req.file.filename}`);
      }
      res.status(404);
      return next(new Error('PDF document not found'));
    }

    // Verify ownership
    if (pdf.user.toString() !== req.user._id.toString()) {
      if (req.file) {
        deletePhysicalFile(`/uploads/${req.file.filename}`);
      }
      res.status(403);
      return next(new Error('Not authorized to update this PDF'));
    }

    const { title, category, notes, isPinned, isFavorite, color, tags, aiSummary } = req.body;

    // Check if new file was uploaded
    let oldFileUrl = null;
    if (req.file) {
      oldFileUrl = pdf.fileUrl;
      pdf.fileUrl = `/uploads/${req.file.filename}`;
      pdf.fileName = req.file.originalname;
      pdf.fileSize = req.file.size;
    }

    // Update metadata fields if they are provided
    if (title !== undefined) pdf.title = title.trim();
    if (category !== undefined) pdf.category = category.trim();
    if (notes !== undefined) pdf.notes = notes.trim();
    if (isPinned !== undefined) pdf.isPinned = String(isPinned) === 'true' || isPinned === true;
    if (isFavorite !== undefined) pdf.isFavorite = String(isFavorite) === 'true' || isFavorite === true;
    if (color !== undefined) pdf.color = color;
    if (aiSummary !== undefined) pdf.aiSummary = aiSummary.trim();
    if (tags !== undefined) {
      if (typeof tags === 'string') {
        try {
          pdf.tags = JSON.parse(tags);
        } catch (e) {
          pdf.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }
      } else {
        pdf.tags = Array.isArray(tags) ? tags : [];
      }
    }

    const updatedPdf = await pdf.save();

    // Clean up physical file if it was replaced
    if (oldFileUrl) {
      deletePhysicalFile(oldFileUrl);
    }

    res.status(200).json({
      success: true,
      data: updatedPdf,
    });
  } catch (error) {
    if (req.file) {
      deletePhysicalFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

// @desc    Delete a PDF
// @route   DELETE /api/pdfs/:id
// @access  Private
export const deletePdf = async (req, res, next) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      res.status(404);
      return next(new Error('PDF document not found'));
    }

    // Verify ownership
    if (pdf.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this PDF'));
    }

    const fileUrl = pdf.fileUrl;

    // Delete record from DB
    await pdf.deleteOne();

    // Delete physical file from uploads folder
    deletePhysicalFile(fileUrl);

    res.status(200).json({
      success: true,
      message: 'PDF document removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

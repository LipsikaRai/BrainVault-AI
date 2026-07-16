import Note from '../models/Note.js';
import Resource from '../models/Resource.js';
import Pdf from '../models/Pdf.js';
import {
  summarizeNote,
  generateNoteTags,
  summarizeResource,
  generateResourceTags,
  summarizePdf,
  generatePdfTags
} from '../utils/geminiService.js';

// Helper to find document and check ownership
const findItemAndVerifyUser = async (itemId, itemType, userId) => {
  let item = null;

  switch (itemType) {
    case 'note':
      item = await Note.findById(itemId);
      break;
    case 'video':
    case 'website':
      item = await Resource.findById(itemId);
      // Extra validation to check if types match
      if (item && item.type !== itemType) {
        throw new Error('Resource type mismatch.');
      }
      break;
    case 'pdf':
      item = await Pdf.findById(itemId);
      break;
    default:
      throw new Error('Invalid item type. Must be note, video, website, or pdf.');
  }

  if (!item) {
    const err = new Error('Item not found.');
    err.statusCode = 404;
    throw err;
  }

  if (item.user.toString() !== userId.toString()) {
    const err = new Error('Not authorized to access this item.');
    err.statusCode = 403;
    throw err;
  }

  return item;
};

// @desc    Generate AI Summary for an item
// @route   POST /api/ai/summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      res.status(400);
      return next(new Error('Please provide itemId and itemType'));
    }

    const item = await findItemAndVerifyUser(itemId, itemType, req.user._id);
    let summary = '';

    if (itemType === 'note') {
      summary = await summarizeNote(item.title, item.content, item.category);
    } else if (itemType === 'video' || itemType === 'website') {
      summary = await summarizeResource(item.type, item.title, item.url, item.notes);
    } else if (itemType === 'pdf') {
      summary = await summarizePdf(item.fileUrl, item.title, item.notes);
    }

    // Save summary in MongoDB
    item.aiSummary = summary;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      data: item,
      summary: summary
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

// @desc    Generate AI Tags for an item
// @route   POST /api/ai/tags
// @access  Private
export const generateTags = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      res.status(400);
      return next(new Error('Please provide itemId and itemType'));
    }

    const item = await findItemAndVerifyUser(itemId, itemType, req.user._id);
    let tags = [];

    if (itemType === 'note') {
      tags = await generateNoteTags(item.title, item.content, item.category);
    } else if (itemType === 'video' || itemType === 'website') {
      tags = await generateResourceTags(item.type, item.title, item.url, item.notes);
    } else if (itemType === 'pdf') {
      tags = await generatePdfTags(item.fileUrl, item.title, item.notes);
    }

    // Save tags in MongoDB
    item.tags = tags;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Tags generated successfully',
      data: item,
      tags: tags
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

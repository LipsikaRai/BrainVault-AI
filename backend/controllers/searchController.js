import Note from '../models/Note.js';
import Resource from '../models/Resource.js';
import Pdf from '../models/Pdf.js';

// @desc    Global search across Notes, Videos, Websites, and PDFs
// @route   GET /api/search
// @access  Private
export const globalSearch = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const userId = req.user._id;

    if (!q.trim()) {
      return res.status(200).json({
        success: true,
        data: {
          notes: [],
          videos: [],
          websites: [],
          pdfs: [],
        },
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    // Search Notes
    const notesPromise = Note.find({
      user: userId,
      $or: [
        { title: regex },
        { content: regex },
        { category: regex },
        { tags: regex },
        { aiSummary: regex },
      ],
    }).sort({ isPinned: -1, updatedAt: -1 });

    // Search Resources (videos & websites)
    const resourcesPromise = Resource.find({
      user: userId,
      $or: [
        { title: regex },
        { notes: regex },
        { url: regex },
        { category: regex },
        { tags: regex },
        { aiSummary: regex },
      ],
    }).sort({ isPinned: -1, updatedAt: -1 });

    // Search PDFs
    const pdfsPromise = Pdf.find({
      user: userId,
      $or: [
        { title: regex },
        { notes: regex },
        { fileName: regex },
        { category: regex },
        { tags: regex },
        { aiSummary: regex },
      ],
    }).sort({ isPinned: -1, updatedAt: -1 });

    // Execute queries in parallel
    const [notes, resources, pdfs] = await Promise.all([
      notesPromise,
      resourcesPromise,
      pdfsPromise,
    ]);

    // Separate resources into videos and websites
    const videos = resources.filter((r) => r.type === 'video');
    const websites = resources.filter((r) => r.type === 'website');

    res.status(200).json({
      success: true,
      data: {
        notes,
        videos,
        websites,
        pdfs,
      },
    });
  } catch (error) {
    next(error);
  }
};

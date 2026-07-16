import Note from '../models/Note.js';

// @desc    Get all notes for logged-in user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res, next) => {
  try {
    const { title, content, category, isPinned, isFavorite, color, tags } = req.body;

    // Backend validation: Title and Content are required
    if (!title || title.trim() === '') {
      res.status(400);
      return next(new Error('Please provide a note title'));
    }
    if (!content || content.trim() === '') {
      res.status(400);
      return next(new Error('Please provide note content'));
    }

    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : 'General',
      isPinned: !!isPinned,
      isFavorite: !!isFavorite,
      color: color || '#4f46e5',
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res, next) => {
  try {
    const { title, content, category, isPinned, isFavorite, color, tags, aiSummary } = req.body;
    const noteId = req.params.id;

    // Find the note
    const note = await Note.findById(noteId);

    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }

    // Check ownership
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this note'));
    }

    // Backend validation if title or content are provided
    if (title !== undefined && title.trim() === '') {
      res.status(400);
      return next(new Error('Note title cannot be empty'));
    }
    if (content !== undefined && content.trim() === '') {
      res.status(400);
      return next(new Error('Note content cannot be empty'));
    }

    // Update fields
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (category !== undefined) note.category = category.trim();
    if (isPinned !== undefined) note.isPinned = !!isPinned;
    if (isFavorite !== undefined) note.isFavorite = !!isFavorite;
    if (color !== undefined) note.color = color;
    if (tags !== undefined) note.tags = Array.isArray(tags) ? tags : [];
    if (aiSummary !== undefined) note.aiSummary = aiSummary.trim();

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    // Find the note
    const note = await Note.findById(noteId);

    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }

    // Check ownership
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this note'));
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

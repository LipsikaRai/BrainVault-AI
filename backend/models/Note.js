import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#4f46e5', // Default Indigo theme color
    },
    tags: {
      type: [String],
      default: [],
    },
    aiSummary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;

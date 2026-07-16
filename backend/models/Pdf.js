import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema(
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
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please add a file URL'],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'Please add a file name'],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'Please add a file size'],
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
      default: '#8b5cf6', // Violet color for PDF resources by default
    },
    aiSummary: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Pdf = mongoose.model('Pdf', pdfSchema);

export default Pdf;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors()); // Allow requests from all origins (suitable for development and staging)
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL encoded payloads

// Serve static upload folders (e.g. PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic API check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'BrainVault AI API is running...' });
});

// Bind authentication routes
app.use('/api/auth', authRoutes);

// Bind note routes
app.use('/api/notes', noteRoutes);

// Bind resource routes
app.use('/api/resources', resourceRoutes);

// Bind PDF routes
app.use('/api/pdfs', pdfRoutes);

// Bind AI routes
app.use('/api/ai', aiRoutes);

// Bind Reminder routes
app.use('/api/reminders', reminderRoutes);

// Bind Search routes
app.use('/api/search', searchRoutes);

// Fallback middlewares for error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


import express from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getYoutubeInfo,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all resource routes
router.use(protect);

// YouTube oEmbed helper route
router.route('/youtube-info').get(getYoutubeInfo);

// Standard CRUD endpoints
router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .put(updateResource)
  .delete(deleteResource);

export default router;

import Resource from '../models/Resource.js';

// Helper to extract YouTube Video ID
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// @desc    Get all resources for logged-in user
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { user: req.user._id };
    
    if (type) {
      filter.type = type;
    }

    const resources = await Resource.find(filter)
      .sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resource (video or website)
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res, next) => {
  try {
    const { type, url, title, notes, category, isPinned, isFavorite, color, thumbnailUrl } = req.body;

    // Validation
    if (!type || !['video', 'website'].includes(type)) {
      res.status(400);
      return next(new Error('Please provide a valid resource type (video or website)'));
    }
    if (!url || url.trim() === '') {
      res.status(400);
      return next(new Error('Please provide a resource URL'));
    }

    let finalTitle = title ? title.trim() : '';
    let finalThumbnailUrl = thumbnailUrl ? thumbnailUrl.trim() : '';

    if (type === 'video') {
      const videoId = getYoutubeId(url);
      if (!videoId) {
        res.status(400);
        return next(new Error('Please provide a valid YouTube URL'));
      }
      
      // If thumbnail URL is not provided, generate it
      if (!finalThumbnailUrl) {
        finalThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      // If title is not provided, auto-fetch from oEmbed
      if (!finalTitle) {
        try {
          const fetchResponse = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
          if (fetchResponse.ok) {
            const embedData = await fetchResponse.json();
            finalTitle = embedData.title || 'YouTube Video';
          } else {
            finalTitle = 'YouTube Video';
          }
        } catch (fetchErr) {
          console.error('Error fetching YouTube info on save:', fetchErr);
          finalTitle = 'YouTube Video';
        }
      }
    } else {
      // Website validation
      if (!finalTitle) {
        res.status(400);
        return next(new Error('Please provide a title for the website'));
      }
    }

    const resource = await Resource.create({
      user: req.user._id,
      type,
      url: url.trim(),
      title: finalTitle,
      notes: notes ? notes.trim() : '',
      category: category ? category.trim() : 'General',
      isPinned: !!isPinned,
      isFavorite: !!isFavorite,
      color: color || '#4f46e5',
      thumbnailUrl: finalThumbnailUrl,
    });

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (req, res, next) => {
  try {
    const { url, title, notes, category, isPinned, isFavorite, color, thumbnailUrl, tags, aiSummary } = req.body;
    const resourceId = req.params.id;

    // Find the resource
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      res.status(404);
      return next(new Error('Resource not found'));
    }

    // Check ownership
    if (resource.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this resource'));
    }

    // Validation
    if (url !== undefined && url.trim() === '') {
      res.status(400);
      return next(new Error('Resource URL cannot be empty'));
    }
    if (title !== undefined && title.trim() === '' && resource.type === 'website') {
      res.status(400);
      return next(new Error('Website title cannot be empty'));
    }

    // If URL is changed for video, re-fetch video info
    if (url !== undefined && url !== resource.url && resource.type === 'video') {
      const videoId = getYoutubeId(url);
      if (!videoId) {
        res.status(400);
        return next(new Error('Please provide a valid YouTube URL'));
      }
      resource.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      
      // Auto-fetch new title if title wasn't manually overridden in this request
      if (title === undefined) {
        try {
          const fetchResponse = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
          if (fetchResponse.ok) {
            const embedData = await fetchResponse.json();
            resource.title = embedData.title || 'YouTube Video';
          }
        } catch (fetchErr) {
          console.error('Error fetching YouTube info on update:', fetchErr);
        }
      }
    }

    // Update fields
    if (url !== undefined) resource.url = url.trim();
    if (title !== undefined) resource.title = title.trim();
    if (notes !== undefined) resource.notes = notes.trim();
    if (category !== undefined) resource.category = category.trim();
    if (isPinned !== undefined) resource.isPinned = !!isPinned;
    if (isFavorite !== undefined) resource.isFavorite = !!isFavorite;
    if (color !== undefined) resource.color = color;
    if (thumbnailUrl !== undefined) resource.thumbnailUrl = thumbnailUrl.trim();
    if (tags !== undefined) resource.tags = Array.isArray(tags) ? tags : [];
    if (aiSummary !== undefined) resource.aiSummary = aiSummary.trim();

    const updatedResource = await resource.save();

    res.status(200).json({
      success: true,
      data: updatedResource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;

    // Find the resource
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      res.status(404);
      return next(new Error('Resource not found'));
    }

    // Check ownership
    if (resource.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this resource'));
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resource removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch info from YouTube URL
// @route   GET /api/resources/youtube-info
// @access  Private
export const getYoutubeInfo = async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      res.status(400);
      return next(new Error('URL is required'));
    }

    const videoId = getYoutubeId(url);
    if (!videoId) {
      res.status(400);
      return next(new Error('Invalid YouTube URL. Please enter a valid watch or share link.'));
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    let title = 'YouTube Video';

    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      if (response.ok) {
        const data = await response.json();
        title = data.title || title;
      }
    } catch (fetchErr) {
      console.error('Error fetching YouTube info:', fetchErr);
    }

    res.status(200).json({
      success: true,
      data: {
        title,
        thumbnailUrl,
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

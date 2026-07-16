import Reminder from '../models/Reminder.js';

// @desc    Get all reminders for logged-in user
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res, next) => {
  try {
    const { title, description, dueDate, color } = req.body;

    // Backend validations
    if (!title || title.trim() === '') {
      res.status(400);
      return next(new Error('Please provide a reminder title'));
    }
    if (!dueDate) {
      res.status(400);
      return next(new Error('Please provide a due date'));
    }

    const reminder = await Reminder.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: new Date(dueDate),
      color: color || '#ef4444',
      isCompleted: false,
    });

    res.status(201).json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req, res, next) => {
  try {
    const { title, description, dueDate, isCompleted, color } = req.body;
    const reminderId = req.params.id;

    // Find the reminder
    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      res.status(404);
      return next(new Error('Reminder not found'));
    }

    // Check ownership
    if (reminder.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this reminder'));
    }

    // Validations if title or dueDate is provided
    if (title !== undefined && title.trim() === '') {
      res.status(400);
      return next(new Error('Reminder title cannot be empty'));
    }

    // Update fields
    if (title !== undefined) reminder.title = title.trim();
    if (description !== undefined) reminder.description = description.trim();
    if (dueDate !== undefined) reminder.dueDate = new Date(dueDate);
    if (isCompleted !== undefined) reminder.isCompleted = !!isCompleted;
    if (color !== undefined) reminder.color = color;

    const updatedReminder = await reminder.save();

    res.status(200).json({
      success: true,
      data: updatedReminder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res, next) => {
  try {
    const reminderId = req.params.id;

    // Find the reminder
    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      res.status(404);
      return next(new Error('Reminder not found'));
    }

    // Check ownership
    if (reminder.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this reminder'));
    }

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reminder removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

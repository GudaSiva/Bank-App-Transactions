
const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification.model");

// @route   GET /notifications
// @desc    Get all notifications
// @access  Private

const getUsersNotifications = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "failed", data: null, error: "Unauthorized" });
  }
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res
      .status(200)
      .json({ status: "succeeded", data: notifications, error: null });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

// @route PATCH /notifications/:id
// @desc Update notification
// @access Private

const updateNotification = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "failed", data: null, error: "Unauthorized" });
  }
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.read = true;
      const updatedNotification = await notification.save();
      res.status(200).json({
        status: "succeeded",
        data: updatedNotification,
        error: null,
      });
    } else {
      res.status(404).json({
        status: "failed",
        data: null,
        error: "Notification not found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

// @route   DELETE /notifications/:id
// @desc    Delete a notification
// @access  Private

const deleteNotification = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "failed", data: null, error: "Unauthorized" });
  }
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", data: null, error: "Unauthorized" });
    }

    if (notification) {
      await notification.remove();
      res.status(200).json({
        status: "succeeded",
        data: null,
        error: null,
      });
    } else {
      res.status(404).json({
        status: "failed",
        data: null,
        error: "Notification not found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

module.exports = {
  getUsersNotifications,
  updateNotification,
  deleteNotification,
};

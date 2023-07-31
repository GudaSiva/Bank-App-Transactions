/**
 * @fileoverview This file contains all notification routes for the notification controller
 */

const express = require("express");
const router = express.Router();

const {
  getUsersNotifications,
  updateNotification,
  deleteNotification,
} = require("../controllers/notification.controller");

router.get("/", getUsersNotifications);
router.patch("/:id", updateNotification);
router.delete("/:id", deleteNotification);

module.exports = router;

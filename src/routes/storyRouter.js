// routes/storyRoutes.js
const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.get("/stories", storyController.getAllStories);
router.get("/story-by-slug/:slug", storyController.getStoryBySlug);

module.exports = router;


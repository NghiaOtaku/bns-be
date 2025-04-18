// routes/storyRoutes.js
const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.get("/stories", storyController.getAllStories);
router.get("/story-by-slug/:slug", storyController.getStoryBySlug);
router.get("/recommended-stories", storyController.getRecommendedStories);
router.get("/story-newest", storyController.getNewestStories);
router.get("/story-list/favorite", storyController.getFavoriteStories);

module.exports = router;


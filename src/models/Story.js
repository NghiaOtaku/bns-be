// models/storySlugModel.js
const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  cover: String,
  desc: String,
  total_words: Number,
  view: Number,
  author: {
    id: Number,
    name: String,
    slug: String,
  },
  status: Number,
  avg_rating: Number,
  np: Number,
  is_free: Boolean,
  transactions_count: Number,
  chapters_count: Number,
  ratings_count: Number,
  comments_count: Number,
  marks_count: Number,
  direct_comments_count: Number,
  updated_at: Date,
  first_chapter_number: Number,
  categories: [
    {
      id: Number,
      name: String,
      slug: String,
    },
  ],
  tags: [
    {
      id: Number,
      name: String,
      slug: String,
    },
  ],
  source: {
    id: Number,
    name: String,
    slug: String,
  },
  contributors: [
    {
      id: Number,
      username: String,
      slug: String,
      role: String,
    },
  ],
});

module.exports = mongoose.model("Story", storySchema, "storyDB");

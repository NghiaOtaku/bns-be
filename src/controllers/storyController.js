// controllers/storyController.js
const Story = require("../models/Story");

exports.getAllStories = async (req, res) => {
  try {
    //  const stories = await Story.find().limit(1); // chỉ lấy 1 item kiểm tra
    //  console.log("Kết quả từ MongoDB:", stories);
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;

    const total = await Story.countDocuments();
    const lastPage = Math.ceil(total / perPage);
    const skip = (page - 1) * perPage;

    const stories = await Story.find().skip(skip).limit(perPage);

    res.json({
      current_page: page,
      data: stories,
      first_page_url: `/?page=1`,
      from: skip + 1,
      last_page: lastPage,
      last_page_url: `/?page=${lastPage}`,
      next_page_url: page < lastPage ? `/?page=${page + 1}` : null,
      path: "/",
      per_page: perPage.toString(),
      prev_page_url: page > 1 ? `/?page=${page - 1}` : null,
      to: skip + stories.length,
      total: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// exports.getAllStories = async (req, res) => {
//   // res.json({message: "Hello from getAllStories"})
//   res.send("Hello from getAllStories");
// }

exports.getStoryBySlug = async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug });
    if (!story)
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};


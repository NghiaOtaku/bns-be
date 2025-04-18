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

exports.getRecommendedStories = async (req, res) => {
  try {
    const perPage = parseInt(req.query.per_page) || 10;

    const stories = await Story.find({
      avg_rating: { $gte: 4 },
      ratings_count: { $gte: 2 },
      marks_count: { $gte: 5 },
    })
      .sort({ avg_rating: -1 }) // sắp xếp điểm cao nhất
      .limit(perPage);

    res.json([
      ...stories
    ]);
  } catch (error) {
    console.error("❌ Lỗi khi lấy recommended stories:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getNewestStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;

    const maxNewest = 100; // ✅ Giới hạn chỉ lấy 100 truyện cập nhật mới nhất

    // Lấy 100 truyện mới nhất
    const newestStories = await Story.find({})
      .sort({ updated_at: -1 })
      .limit(maxNewest);

    const total = newestStories.length;
    const lastPage = Math.ceil(total / perPage);

    // Cắt truyện theo trang
    const paginatedStories = newestStories.slice(
      (page - 1) * perPage,
      page * perPage
    );

    res.json({
      current_page: page,
      data: paginatedStories,
      first_page_url: `/?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: lastPage,
      last_page_url: `/?page=${lastPage}`,
      next_page_url: page < lastPage ? `/?page=${page + 1}` : null,
      path: "/",
      per_page: perPage,
      prev_page_url: page > 1 ? `/?page=${page - 1}` : null,
      to: Math.min(page * perPage, total),
      total: total,
    });
  } catch (error) {
    console.error("❌ Error in getNewestStories:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getFavoriteStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;

    // Lấy tối đa 100 truyện có np > 0 và sắp xếp giảm dần
    const topStories = await Story.find({ np: { $gt: 0 } })
      .sort({ np: -1 })
      .limit(100); // ✅ giới hạn 100 truyện

    const total = topStories.length;
    const lastPage = Math.ceil(total / perPage);

    // Phân trang trong 100 truyện đã lấy
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedStories = topStories.slice(start, end);

    res.json({
      current_page: page,
      data: paginatedStories,
      first_page_url: `/?page=1`,
      from: start + 1,
      last_page: lastPage,
      last_page_url: `/?page=${lastPage}`,
      next_page_url: page < lastPage ? `/?page=${page + 1}` : null,
      path: "/",
      per_page: perPage,
      prev_page_url: page > 1 ? `/?page=${page - 1}` : null,
      to: Math.min(end, total),
      total: total,
    });
  } catch (error) {
    console.error("❌ Error in getFavoriteStories:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};




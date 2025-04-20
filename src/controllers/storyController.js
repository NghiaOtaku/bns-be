// controllers/storyController.js
const Story = require("../models/Story");

exports.getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;

    // Lấy filter theo name
    const nameFilter = req.query.name
      ? { name: { $regex: req.query.name, $options: "i" } }
      : {};

    // Lấy sort field và order
    const sortField = req.query.sort || "name";
    const sortOrder = req.query.order === "ASC" ? -1 : 1;

    // Tổng số document
    const total = await Story.countDocuments(nameFilter);
    const lastPage = Math.ceil(total / perPage);
    const skip = (page - 1) * perPage;

    // Truy vấn MongoDB
    const stories = await Story.find(nameFilter)
      .skip(skip)
      .limit(perPage)
      .collation({ locale: "vi", strength: 1 })
      .sort({ [sortField]: sortOrder });

    // Trả về kết quả
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
    console.error("Lỗi backend:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// exports.getAllStories = async (req, res) => {
//   // res.json({message: "Hello from getAllStories"})
//   res.send("Hello from getAllStories");
// }

exports.getStoryByID = async (req, res) => {
  console.log("ID truyện:", req.params.id);
  try {
    const storyID = await Story.findOne({ id: req.params.id });
    if (!storyID)
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    res.json(storyID);
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




// controllers/auth.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      fullname: fullname,
      email: email,
      role_id: req.body.role_id, // ví dụ: 2 cho user, 1 cho admin
      slug: req.body.slug, // bạn có thể tạo slug từ username nếu muốn
      role_list: [{ name: "user" }], // hoặc 'admin' nếu là admin
      password: password, // bcrypt sẽ tự mã hóa trong schema pre-save
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ ...userData, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };

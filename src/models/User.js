const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Thêm bcrypt để mã hóa mật khẩu

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified_at: {
    type: Date,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  bank_account: {
    type: String,
    default: null,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  balance: {
    type: Number,
    default: 0.0,
  },
  role_id: {
    type: Number,
    required: true,
    default: 2, // 2 là user, 1 là admin
  },
  avatar: {
    type: String,
    default: "https://ngocsach.com/storage/",
  },
  avatar_original: {
    type: String,
    default: "https://ngocsach.com/storage/",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    default: null,
  },
  birthday: {
    type: Date,
    default: "01-01-1970",
  },
  cover: {
    type: String,
    default: "https://ngocsach.com/storage/",
  },
  cover_original: {
    type: String,
    default: "https://ngocsach.com/storage/",
  },
  remember_bank: {
    type: Boolean,
    default: false,
  },
  bank_name: {
    type: String,
    default: null,
  },
  ttkm: {
    type: Number,
    default: 0.0,
  },
  np: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  two_factor_code: {
    type: String,
    default: null,
  },
  two_factor_expires_at: {
    type: Date,
    default: null,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
  block_reason: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  role_list: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  password: {
    type: String,
    required: true, // Mật khẩu là trường bắt buộc
  },
});

// Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Nếu mật khẩu không thay đổi thì không mã hóa lại
  this.password = await bcrypt.hash(this.password, 10); // Mã hóa mật khẩu với bcrypt
  next();
});

// So sánh mật khẩu nhập vào với mật khẩu lưu trong DB
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema, "userDB");

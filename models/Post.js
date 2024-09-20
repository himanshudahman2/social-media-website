const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  content: String,
  author: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  comments: [commentSchema]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

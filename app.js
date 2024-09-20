const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const app = express();

// Set up EJS and middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialmedia')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Home route - Display all posts
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('home', { posts });
});

// Route to create a new post with image URL
app.post('/create-post', async (req, res) => {
  try {
    const { content, author, imageUrl } = req.body;
    await Post.create({ content, author, imageUrl });
    res.redirect('/');
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle "Like" functionality
app.post('/like-post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.likes += 1;
      await post.save();
    }
    res.redirect('/');
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display post details
app.get('/post-details/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments');
    if (post) {
      res.render('post-details', { post });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error('Error fetching post details:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle comment submission
app.post('/add-comment/:postId', async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.postId);
    if (post) {
      post.comments.push({ text: comment });
      await post.save();
    }
    res.redirect(`/post-details/${req.params.postId}`);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(8080, () => console.log('Server running on port 8080'));

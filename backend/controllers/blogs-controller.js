const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Blog = require("../models/blog");

// const dummyBlogs = [
//   {
//     title: "The Ultimate Guide to Cooking Pasta",
//     content: "Learn how to cook perfect pasta every time, from boiling water to sauce pairings!",
//     user: "chefGordon",
//     date: new Date("2023-11-01")
//   },
//   {
//     title: "Mastering Homemade Sauces",
//     content: "A comprehensive guide on creating rich and flavorful homemade sauces.",
//     user: "chefJamie",
//     date: new Date("2023-11-05")
//   },
//   {
//     title: "Baking the Perfect Sourdough",
//     content: "Everything you need to know to bake a perfect loaf of sourdough from scratch.",
//     user: "chefMary",
//     date: new Date("2023-11-10")
//   }
// ];

// Retrieve blog post by username
const getBlogByUser = async (req, res, next) => {
  const username = req.params.username;

  let blog;
  try {
    blog = await Blog.find({ user: username });
  } catch (err) {
    return next(new HttpError("Could not find a blog for the provided user.", 500));
  }

  if (!blog) {
    return next(new HttpError("No blog found for the provided user.", 404));
  }

  res.json({ blog: blog.toObject({ getters: true }) });
};

// Create a new blog post
const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data.", 422));
  }

  const { title, content, user } = req.body;

  const createdBlog = new Blog({
    title,
    content,
    user,
    date: new Date(),
  });

  try {
    await createdBlog.save();
  } catch (err) {
    return next(new HttpError("Creating blog failed, please try again.", 500));
  }

  res.status(201).json({ blog: createdBlog });
};

// Get all blog posts
const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    return next(new HttpError("Fetching blogs failed, please try again.", 500));
  }

  res.json({ blogs: blogs.map(blog => blog.toObject({ getters: true })) });
};

// Update a blog post
const updateBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check your data.", 422));
  }

  const { title, content } = req.body;
  const blogId = req.params.blogId;

  let blog;
  try {
    blog = await Blog.findById(blogId);
    if (!blog) {
      return next(new HttpError("Blog not found.", 404));
    }

    blog.title = title;
    blog.content = content;
    await blog.save();
  } catch (err) {
    return next(new HttpError("Updating blog failed, please try again.", 500));
  }

  res.status(200).json({ blog: blog.toObject({ getters: true }) });
};

// Delete a blog post
const deleteBlog = async (req, res, next) => {
  const blogId = req.params.blogId;

  try {
    await Blog.findByIdAndRemove(blogId);
  } catch (err) {
    return next(new HttpError("Deleting blog failed, please try again.", 500));
  }

  res.status(200).json({ message: "Blog deleted." });
};

exports.getBlogByUser = getBlogByUser;
exports.createBlog = createBlog;
exports.getAllBlogs = getAllBlogs;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
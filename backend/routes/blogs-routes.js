const express = require("express");
const { check } = require("express-validator");

const blogsController = require("../controllers/blogs-controller");

const router = express.Router();

// Retrieve all blog posts
router.get("/", blogsController.getAllBlogs);

// Retrieve blog post by ID
router.get("/:blogId", blogsController.getBlogById);

// Insert a new blog post
router.post(
  "/",
  [
    check("title").not().isEmpty().isLength({ min: 5 }),
    check("content").not().isEmpty(),
    check("author").not().isEmpty(),
  ],
  blogsController.createBlog
);

// Update a blog post
router.patch(
  "/:blogId",
  [
    check("title").not().isEmpty().isLength({ min: 5 }),
    check("content").not().isEmpty(),
  ],
  blogsController.updateBlog
);

// Delete a blog post
router.delete("/:blogId", blogsController.deleteBlog);

module.exports = router;


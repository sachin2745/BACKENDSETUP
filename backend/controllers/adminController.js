const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// Controller function to handle the blogs data fetching
const getBlogs = async (req, res) => {
  // SQL query to fetch blogs with joined categories
  const sql = `
      SELECT 
        blogs.*, 
        GROUP_CONCAT(blog_category.blog_category_name) AS blogCategory 
      FROM 
        blogs 
      LEFT JOIN 
        blog_category 
      ON 
        JSON_CONTAINS(blogs.blogCategory, CONCAT('[', blog_category.blog_category_id, ']')) = 1 
      GROUP BY 
        blogs.blogId 
      ORDER BY 
        blogs.blogSortby ASC
    `;

  const categoriesSql = `
      SELECT 
        * 
      FROM 
        blog_category
    `;

  try {
    // Execute the query for blogs
    const [blogs] = await db.execute(sql);

    // Execute the query for blog categories
    const [blogCategories] = await db.execute(categoriesSql);

    // Return the data as JSON
    return res.status(200).json({ blogs, blogCategories });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const updateStatus = async (req, res) => {
  const blogId = req.params.id;
  const { blogSortBy, blogStatus } = req.body;

  let query = "";
  const params = [];

  if (blogSortBy !== undefined) {
    query = "UPDATE blogs SET blogSortBy = ? WHERE blogId = ?";
    params.push(blogSortBy, blogId);
  } else if (blogStatus !== undefined) {
    query = "UPDATE blogs SET blogStatus = ? WHERE blogId = ?";
    params.push(blogStatus, blogId);
  }
  if (!query) {
    return res.status(400).send("Invalid input: no fields to update.");
  }
  try {
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("Blog not found.");
    } else {
      res.status(200).send("Blog updated successfully.");
    }
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).send("Error updating blog.");
  }
};

const addBlog = async (req, res) => {
  const {
    blogTitle,
    blogDescription,
    blogContent,
    blogImgAlt,
    blogImageName,
    blogImageTitle,
    blogCategory,
    blogKeywords,
    blogMetaTitle,
    blogForceKeywords,
    blogMetaDescription,
    blogMetaKeywords,
    blogPostDate,
    blogStatus,
  } = req.body;

  const blogCreatedTime = Math.floor(Date.now() / 1000); // Unix timestamp
  const blogSortBy = await db
    .query("SELECT MAX(blogId) + 1 AS nextSort FROM blogs")
    .then(([rows]) => rows[0]?.nextSort || 1);

  try {
    await db.query(
      `INSERT INTO blogs (blogTitle, blogDescription, blogContent, blogImgAlt, blogImageName, blogImageTitle, blogCategory, blogKeywords, blogMetaTitle, blogForceKeywords, blogMetaDescription, blogMetaKeywords, blogPostDate, blogStatus, blogCreatedTime, blogSortBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        blogTitle,
        blogDescription,
        blogContent,
        blogImgAlt,
        blogImageName,
        blogImageTitle,
        blogCategory,
        blogKeywords,
        blogMetaTitle,
        blogForceKeywords,
        blogMetaDescription,
        blogMetaKeywords,
        blogPostDate,
        blogStatus,
        blogCreatedTime,
        blogSortBy,
      ]
    );

    res.status(200).json({ message: "Blog added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  getBlogs,
  updateStatus,
  addBlog,
};

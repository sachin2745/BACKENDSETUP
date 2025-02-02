const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getBlogs = async (req, res) => {
  // SQL query to fetch blogs with joined categories
  const sql = `
      SELECT 
        blogs.*, 
        blog_category.blog_category_name AS blogCategory 
      FROM 
        blogs 
      LEFT JOIN 
        blog_category 
      ON 
        blogs.blogCategory = blog_category.blog_category_id      
      WHERE 
        blogs.blogStatus = 0
      ORDER BY 
        blogs.blogSortby ASC
    `;

  try {
    // Execute the query for blogs
    const [blogs] = await db.execute(sql);

    // Return the data as JSON
    return res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const getBlogBySku = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        blogs.*, 
        blog_category.blog_category_name AS blogCategory 
      FROM 
        blogs 
      LEFT JOIN 
        blog_category 
      ON 
        blogs.blogCategory = blog_category.blog_category_id      
      WHERE 
        blogs.blogSKU LIKE  ?
      ORDER BY 
        blogs.blogSortby ASC
    `,
      [`%${slug}%`]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRecentBlogs = async (req, res) => {
  // SQL query to fetch blogs with joined categories
  const sql = `
      SELECT 
        blogId, blogTitle, blogImage, blogImgAlt, blogSKU
      FROM 
        blogs          
      WHERE 
        blogStatus = 0
      ORDER BY 
        blogId DESC
      LIMIT 4
    `;

  try {
    // Execute the query for blogs
    const [recentBlogs] = await db.execute(sql);

    // Return the data as JSON
    return res.status(200).json({ recentBlogs });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const searchBlog = async (req, res) => {
  if (req.method === "GET") {
    const { query } = req.query;

    // console.log("Search query:", query);

    try {
      const [rows] = await db.execute(
        "SELECT  blogId, blogTitle, blogSKU  FROM blogs WHERE blogTitle LIKE ? AND blogStatus = 0 LIMIT 10",
        [`%${query}%`]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

const addComment = async (req, res) => {
  const blogId = req.params.id;
  const { commentText, name, email } = req.body;

  const commentAddedDate = Math.floor(Date.now() / 1000);

  const query =
    "INSERT INTO blogcomments (commentBlogId, commentText, commentAddedByName, commentAddedByEmail, commentAddedDate, commentStatus) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [blogId, commentText, name, email, commentAddedDate, "2"]; //'2' as a String bacause using enum
  try {
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Failed to add comment." });
    } else {
      return res.status(200).json({
        message: "Comment added successfully",
        comment: { commentText, name, email, commentAddedDate },
      });
    }
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({ message: "Error adding comment." });
  }
};

const getComments = async (req, res) => {
  const { blogSlug } = req.params; // Destructure to get blogSlug from params

  const query = `SELECT blogcomments.*, blogs.blogSKU FROM blogcomments
  LEFT JOIN blogs ON blogcomments.commentBlogId = blogs.blogId
  WHERE blogs.blogSKU LIKE ? AND blogcomments.commentStatus = '0' 
  ORDER BY blogCommentId  DESC`;

  try {
    const [rows] = await db.execute(query, [`%${blogSlug}%`]);
    // console.log("rows", rows);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ message: "Error fetching comments." });
  }
};

module.exports = {
  getBlogs,
  getBlogBySku,
  getRecentBlogs,
  searchBlog,
  addComment,
  getComments,
};

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
  if (req.method === 'GET') {
    const { query } = req.query;

    // console.log("Search query:", query);
    
    try {
      const [rows] = await db.execute(
        'SELECT  blogId, blogTitle, blogSKU  FROM blogs WHERE blogTitle LIKE ? AND blogStatus = 0 LIMIT 10',
        [`%${query}%`]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};


module.exports = {
  getBlogs,
  getBlogBySku,
  getRecentBlogs,
  searchBlog,
};

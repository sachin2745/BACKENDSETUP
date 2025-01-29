const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getBlogBySku = async (req, res) => {
  try {
    const {slug}  = req.params; 

    // const [rows] = await db.query("SELECT * FROM blogs WHERE blogSKU = ?", [slug]);
    const [rows] = await db.query( `
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
        blogs.blogStatus = 0 And blogs.blogSKU = ?
      ORDER BY 
        blogs.blogSortby ASC
    `, [slug]);

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

module.exports = {
  getBlogBySku,
};

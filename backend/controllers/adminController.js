const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller function to handle the blogs data fetching
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
        blogs.blogStatus != 3
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

// const addBlog = async (req, res) => {
//   const {
//     blogTitle,
//     blogDescription,
//     blogContent,
//     blogImgAlt,
//     blogImageName,
//     blogImageTitle,
//     blogCategory,
//     blogKeywords,
//     blogMetaTitle,
//     blogForceKeywords,
//     blogMetaDescription,
//     blogMetaKeywords,
//     blogStatus,
//     blogSchema,
//     blogSKU,
//   } = req.body;

//   const blogCreatedTime = Math.floor(Date.now() / 1000); // Unix timestamp
//   const  blogPostDate = Math.floor(Date.now() / 1000);

//   const blogImage = req.files?.blogImage?.[0]?.path
//   ? `/uploads/blog/${req.files.blogImage[0].filename}`
//   : null;
// const blogImageMobile = req.files?.blogImageMobile?.[0]?.path
//   ? `/uploads/blog/${req.files.blogImageMobile[0].filename}`
//   : null;

// console.log("Request body:", req.body);
// console.log("Uploaded files:", req.files);

//   const blogSortBy = await db
//     .query("SELECT MAX(blogId) + 1 AS nextSort FROM blogs")
//     .then(([rows]) => rows[0]?.nextSort || 1);

//   try {
//     await db.query(
//       `INSERT INTO blogs (blogTitle, blogImage, blogImageMobile,  blogDescription, blogContent, blogImgAlt, blogImageName, blogImageTitle, blogCategory, blogKeywords, blogMetaTitle, blogForceKeywords, blogMetaDescription, blogMetaKeywords, blogPostDate, blogStatus, blogCreatedTime, blogSortBy, blogSchema, blogSKU)
//       VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
//       [
//         blogTitle,
//         blogImage ,
//         blogImageMobile ,
//         blogDescription,
//         blogContent,
//         blogImgAlt,
//         blogImageName,
//         blogImageTitle,
//         blogCategory,
//         blogKeywords,
//         blogMetaTitle,
//         blogForceKeywords,
//         blogMetaDescription,
//         blogMetaKeywords,
//         blogPostDate,
//         blogStatus,
//         blogCreatedTime,
//         blogSortBy,
//         blogSchema,
//         blogSKU,
//       ]
//     );

//     res.status(200).json({ message: "Blog added successfully" });
//   } catch (error) {
//     console.error("Error adding blog:", error.response ? error.response.data : error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

const addBlog = async (req, res) => {
  try {
    const { blogTitle, blogDescription, blogCategory } = req.body;

    // Save image
    const blogImage = req.files?.blogImage?.[0]?.path
      ? `/uploads/blogImage/${req.files.blogImage[0].filename}`
      : null;

    // Insert data into blogs table
    const query = `
      INSERT INTO blogs (blogTitle, blogDescription, blogImage, blogCategory)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      blogTitle,
      blogDescription,
      blogImage,
      blogCategory,
    ]);

    res
      .status(200)
      .json({ message: "Blog inserted successfully", blogId: result.insertId });
  } catch (error) {
    console.error("Error inserting blog:", error);
    res.status(500).json({ message: "Error inserting blog" });
  }
};

const getBlog = async (req, res) => {
  const blogId = req.params.id;

  const [rows] = await db.query(
    "SELECT blogs.*, blog_category.blog_category_name AS blogCategory FROM blogs  LEFT JOIN blog_category ON blogs.blogCategory = blog_category.blog_category_id  WHERE blogId = ?",
    [blogId]
  );
  //  console.log("rows", rows)
  if (rows.length) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
};

const updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { blogTitle, blogDescription, blogCategory } = req.body;

  const blogImage = req.files?.blogImage?.[0]?.path
    ? `/uploads/blogImage/${req.files.blogImage[0].filename}`
    : null;

  await db.query(
    "UPDATE blogs SET blogTitle = ?, blogDescription = ?, blogCategory = ?, blogImage = ? WHERE blogId = ?",
    [blogTitle, blogDescription, blogCategory, blogImage, blogId]
  );

  res.json({ success: "Blog updated successfully" });
};

module.exports = {
  getBlogs,
  updateStatus,
  addBlog,
  getBlog,
  updateBlog,
};

const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const updateCatStatus = async (req, res) => {
  const blog_category_id  = req.params.id;
  const { blog_category_status } = req.body;

  let query = "";
  const params = [];

  if (blog_category_status !== undefined) {
    query = "UPDATE blog_category SET blog_category_status = ? WHERE blog_category_id = ?";
    params.push(blog_category_status, blog_category_id);
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
  try {
    const {
      blogTitle,
      blogContent,
      blogDescription,
      blogImgAlt,
      blogCategory,
      blogKeywords,
      blogMetaTitle,
      blogMetaDescription,
      blogMetaKeywords,
      blogForceKeywords,
      blogSKU,
      blogSchema,
      blogStatus,
    } = req.body;

    // Save image
    const blogImage = req.files?.blogImage?.[0]?.path
      ? `/uploads/blogImage/${req.files.blogImage[0].filename}`
      : null;
      const blogImageMobile = req.files?.blogImageMobile?.[0]?.path
      ? `/uploads/blogImageMobile/${req.files.blogImageMobile[0].filename}`
      : null;

    const blogCreatedTime = Math.floor(Date.now() / 1000); // Unix timestamp

    const blogSortBy = await db
      .query("SELECT MAX(blogId) + 1 AS nextSort FROM blogs")
      .then(([rows]) => rows[0]?.nextSort || 1);

    // Insert data into blogs table
    const query = `
      INSERT INTO blogs (blogTitle, blogContent , blogDescription, blogImage, blogImageMobile, blogImgAlt, blogCategory,blogKeywords, blogMetaTitle, blogMetaDescription, blogMetaKeywords, blogForceKeywords, blogSKU, blogSchema, blogStatus,blogSortBy,blogCreatedTime)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const [result] = await db.execute(query, [
      blogTitle,
      blogContent,
      blogDescription,
      blogImage,
      blogImageMobile,
      blogImgAlt,
      blogCategory,
      blogKeywords,
      blogMetaTitle,
      blogMetaDescription,
      blogMetaKeywords,
      blogForceKeywords,
      blogSKU,
      blogSchema,
      blogStatus,
      blogSortBy,
      blogCreatedTime,
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
  const {
    blogTitle,
    blogContent,
    blogDescription,
    blogImgAlt,
    blogCategory,
    blogKeywords,
    blogMetaTitle,
    blogMetaDescription,
    blogMetaKeywords,
    blogForceKeywords,
    blogSKU,
    blogSchema,
  } = req.body;

  const blogImage = req.files?.blogImage?.[0]?.path
    ? `/uploads/blogImage/${req.files.blogImage[0].filename}`
    : null;
    const blogImageMobile = req.files?.blogImageMobile?.[0]?.path
    ? `/uploads/blogImageMobile/${req.files.blogImageMobile[0].filename}`
    : null;

  const blogUpdatedTime = Math.floor(Date.now() / 1000); // Unix timestamp

  await db.query(
    "UPDATE blogs SET blogTitle = ?,blogContent = ?, blogDescription = ?,blogImgAlt =?, blogCategory = ?, blogImage = ?,blogImageMobile=?,blogKeywords=?,blogMetaTitle=?,blogMetaDescription=? ,blogMetaKeywords=?,blogForceKeywords=?,blogSKU=?,blogSchema=?,blogUpdatedTime=? WHERE blogId = ?",
    [
      blogTitle,
      blogContent,
      blogDescription,
      blogImgAlt,
      blogCategory,
      blogImage,
      blogImageMobile,
      blogKeywords,
      blogMetaTitle,
      blogMetaDescription,
      blogMetaKeywords,
      blogForceKeywords,
      blogSKU,
      blogSchema,
      blogUpdatedTime,
      blogId
    ]
  );

  res.json({ success: "Blog updated successfully" });
};

module.exports = {
    updateCatStatus,
  addBlog,
  getBlog,
  updateBlog,
};

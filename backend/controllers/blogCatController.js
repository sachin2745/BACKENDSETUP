const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const updateCatStatus = async (req, res) => {
  const blog_category_id = req.params.id;
  const { blog_category_status } = req.body;

  let query = "";
  const params = [];

  if (blog_category_status !== undefined) {
    query =
      "UPDATE blog_category SET blog_category_status = ? WHERE blog_category_id = ?";
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

const addBlogCategory = async (req, res) => {
  try {
    const {
      blog_category_name,
      blog_category_sku,
      blog_category_meta_title,
      blog_category_meta_desc,
      blog_category_meta_keywords,
      blog_category_status,
    } = req.body;


    const blog_category_time = Math.floor(Date.now() / 1000); // Unix timestamp

    // Insert data into blogs table
    const query = `
      INSERT INTO blog_category (blog_category_name, blog_category_sku , blog_category_meta_title, blog_category_meta_desc, blog_category_meta_keywords, blog_category_status, blog_category_time)
      VALUES (?,?,?,?,?,?,?)
    `;

 
    const [result] = await db.execute(query, [
      blog_category_name,
      blog_category_sku,
      blog_category_meta_title,
      blog_category_meta_desc,
      blog_category_meta_keywords,
      blog_category_status,
      blog_category_time,
    ]);

    res
      .status(200)
      .json({ message: "Blog category inserted successfully" });
  } catch (error) {
    console.error("Error inserting blog:", error.message); // Log the error message
    console.error(error.stack); // Log the stack trace for more context
    res.status(500).json({ message: "Error inserting blog" });
  }
};

const getBlogCategory = async (req, res) => {
  const blog_category_id  = req.params.id;

  const [rows] = await db.query(
    "SELECT * FROM blog_category WHERE blog_category_id  = ?",
    [blog_category_id ]
  );
  //  console.log("rows", rows)
  if (rows.length) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
};

const updateBlogCategory = async (req, res) => {
  const blog_category_id = req.params.id;
  const {
    blog_category_name,
    blog_category_sku,
    blog_category_meta_title,
    blog_category_meta_desc,
    blog_category_meta_keywords,
  } = req.body;
 
  const blog_category_time = Math.floor(Date.now() / 1000); // Unix timestamp

  await db.query(
    "UPDATE blog_category SET blog_category_name = ?,blog_category_sku = ?, blog_category_meta_title = ?,blog_category_meta_desc =?, blog_category_meta_keywords = ?, blog_category_time = ? WHERE blog_category_id = ?",
    [
        blog_category_name,
        blog_category_sku,
        blog_category_meta_title,
        blog_category_meta_desc,
        blog_category_meta_keywords,
        blog_category_time,
        blog_category_id ,
    ]
  );

  res.json({ success: "Blog category updated successfully" });
};

module.exports = {
  updateCatStatus,
  addBlogCategory,
  getBlogCategory,
  updateBlogCategory,
};

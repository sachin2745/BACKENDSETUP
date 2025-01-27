const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getCounts = async (req, res) => {
  try {
    // Fetch counts from the tables
    const [blogs] = await db.query(
      "SELECT COUNT(*) AS count FROM blogs WHERE blogStatus != 3"
    );
    const [categories] = await db.query(
      "SELECT COUNT(*) AS count FROM blog_category WHERE blog_category_status != 3"
    );
    const [users] = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE userStatus != 3"
    );

    // console.log("blogs", blogs);
    // console.log("categories", categories);
    // console.log("users", users);
    
    // Send the response
    res.status(200).json({
        blogsCount: blogs[0].count,
        categoriesCount: categories[0].count,
        usersCount: users[0].count,
      });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};

module.exports = {
    getCounts,
  };

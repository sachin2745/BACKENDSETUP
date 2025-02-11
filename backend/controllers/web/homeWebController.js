const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getHomeDetails = async (req, res) => {
  const homeSql = `
      SELECT * FROM pages        
      WHERE 
        pageId = 1 AND pageStatus = 0
    `;

  try {
    // Execute the query for terms and condition
    const [home] = await db.execute(homeSql);

    // Return the data as JSON
    return res.status(200).json({ home });
  } catch (err) {
    console.error("Error fetching home page details:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

module.exports = {
  getHomeDetails,
};

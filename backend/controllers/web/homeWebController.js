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

const SubmitEnquiryForm = async (req, res) => {
  try {
    const { name, number, message } = req.body;
    if (!name || !number || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const postedAt = Math.floor(Date.now() / 1000); // Unix timestamp

    await db.execute(
      "INSERT INTO enquiry (enquiryName, enquiryNumber, enquiryMsg, postedAt) VALUES (?, ?, ?, ?)",
      [name, number, message, postedAt] // Added missing postedAt parameter
    );

    res.status(200).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getHomeDetails,
  SubmitEnquiryForm,
};

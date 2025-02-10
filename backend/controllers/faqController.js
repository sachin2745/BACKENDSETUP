const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getWebsiteFaq = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM faq WHERE faqStatus != 3 ORDER BY faqSortBy ASC`);

    if (rows.length > 0) {
      res.json(rows); // Return the all data
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateWebsiteFaqStatus = async (req, res) => {
  const faqId = req.params.id;
  const { faqSortBy, faqStatus } = req.body;

  let query = "";
  const params = [];

  try {
    // Build the query and parameters dynamically
    if (faqSortBy !== undefined) {
      query = "UPDATE faq SET faqSortBy = ? WHERE faqId = ?";
      params.push(faqSortBy, faqId);
    } else if (faqStatus !== undefined) {
      query = "UPDATE faq SET faqStatus = ? WHERE faqId = ?";
      params.push(faqStatus, faqId);
    } else {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Execute the query
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("Website Faq not found.");
    } else {
      res.status(200).send("Website Faq updated successfully.");
    }
  } catch (err) {
    console.error("Error updating website Faq:", err);
    res.status(500).send("Error updating website Faq.");
  }
};

const addWebsiteFaq = async (req, res) => {
  const { faqQuestion, faqAnswer } = req.body;

  try {
    // Step 1: Get the maximum userId and calculate userSortBy
    const getMaxUserIdQuery = `SELECT MAX(faqId) AS maxUserId FROM faq`;
    const [maxUserIdResult] = await db.execute(getMaxUserIdQuery);

    const nextUserId = (maxUserIdResult[0].maxUserId || 0) + 1; // If no userId exists, start with 1
    const faqSortBy = nextUserId;

    // Step 2: Insert the new user with the calculated userSortBy
    const insertUserQuery = `
      INSERT INTO faq (faqQuestion, faqAnswer, faqSortBy)
      VALUES (?, ?, ?)
    `;
    const [insertResult] = await db.execute(insertUserQuery, [
      faqQuestion,
      faqAnswer,
      faqSortBy,
    ]);

    res.status(201).send({
      message: "Website faq added successfully",
      faqId: insertResult.insertId,
    });
  } catch (err) {
    console.error("Error adding website faq:", err);
    res.status(500).send({
      message: "Error adding website faq",
      error: err.sqlMessage || err.message,
    });
  }
};

const getWebsiteFaqById = async (req, res) => {
  const faqId = req.params.id;
  const query = "SELECT * FROM faq WHERE faqId  = ?";

  try {
    const [rows] = await db.execute(query, [faqId]); // Use execute for parameterized queries
    if (rows.length === 0) {
      return res.status(404).send({ message: "Website faq not found" });
    }
    res.send(rows[0]);
  } catch (error) {
    console.error("Database query error:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching the website faq" });
  }
};

const updateWebsiteFaq = async (req, res) => {
  const faqId = req.params.id;
  const { faqQuestion, faqAnswer } = req.body;

  let query = `
    UPDATE faq
    SET
      faqQuestion = ?,
      faqAnswer = ?
  `;

  const params = [faqQuestion, faqAnswer];

  query += ` WHERE faqId = ?`;
  params.push(faqId);

  try {
    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Website faq not found" });
    }
    res.send({ message: "Website faq updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).send({ message: "Error updating website faq" });
  }
};

module.exports = {
  getWebsiteFaq,
  updateWebsiteFaqStatus,
  addWebsiteFaq,
  getWebsiteFaqById,
  updateWebsiteFaq,
};

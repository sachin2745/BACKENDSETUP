const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getContacts = async (req, res) => {
  const sql = `
      SELECT 
        settingId, 
        callingNumber, 
        whatsappNumber
      FROM 
        setting  
      WHERE
        settingId = 1
    `;

  try {
    const [rows] = await db.execute(sql);

    // Check if data exists
    if (rows.length === 0) {
      return res.status(404).json({ message: "No contact information found." });
    }

    // Return the first row since settingId = 1 is expected to be unique
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getContacts,
};

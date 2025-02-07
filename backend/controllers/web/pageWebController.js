const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getLegalDocuments = async (req, res) => {
  const termsSql = `
      SELECT * FROM pages        
      WHERE 
        pageId = 6 AND pageStatus = 0
    `;

  const privacySql = `
    SELECT * FROM pages        
    WHERE 
      pageId = 5  AND pageStatus = 0
  `;

  const refundSql = `
  SELECT * FROM pages        
  WHERE 
    pageId = 7  AND pageStatus = 0
`;

  try {
    // Execute the query for terms and condition
    const [terms] = await db.execute(termsSql);

    // Execute the query for privacy policy
    const [privacy] = await db.execute(privacySql);

    // Execute the query for refund policy
    const [refund] = await db.execute(refundSql);

    // Return the data as JSON
    return res.status(200).json({ terms, privacy, refund });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

module.exports = {
  getLegalDocuments,
};

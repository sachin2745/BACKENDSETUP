const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getContactDetails = async (req, res) => {
  const contactSql = `
      SELECT * FROM pages        
      WHERE 
        pageId = 2 AND pageStatus = 0
    `;

  const settingSql = `
      SELECT 
      setting.settingId ,
      setting.companyName ,
      setting.officialEmail ,
      setting.officialAddress ,
      setting.embedMapUrl
       FROM setting
      WHERE
        settingId  = 1 
    `;

  

  try {
    // Execute the query for terms and condition
    const [contacts] = await db.execute(contactSql);
    const [settings] = await db.execute(settingSql);

   

    // Return the data as JSON
    return res.status(200).json({ contacts , settings });
  } catch (err) {
    console.error("Error fetching contact page details:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

module.exports = {
  getContactDetails,
};

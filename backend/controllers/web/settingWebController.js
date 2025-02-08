const db = require("../../config/db");
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

const getFooterData = async (req, res) => {
  const footerSql = `
    SELECT
      setting.settingId,
      setting.companyName,
      setting.companyLogo,
      setting.settingShortDescription,
      setting.facebookUrl,
      setting.twitterUrl,
      setting.youtubeUrl,
      setting.instagramUrl,
      setting.linkedinUrl,
      setting.telegramUrl,
      setting.googleUrl,
      setting.intelUrl,
      setting.appleUrl,
      setting.windowsUrl
    FROM setting  
    WHERE settingId = 1
  `;

  const companySql = `
    SELECT 
    pages.pageTitle,
    pages.pageType
     FROM pages  
    WHERE aClientsPagesId = 1
  `;

  try {
    // Execute both queries in parallel
    const [footerRows] = await db.execute(footerSql);
    const [companyRows] = await db.execute(companySql);

    // Check if footer data exists
    if (footerRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No footer data information found." });
    }

    // Prepare the response with both footer and company data
    const responseData = {
      footerData: footerRows[0], // Assuming settingId = 1 is unique
      companyData: companyRows.length > 0 ? companyRows : null, // Handle case if no company data found
    };

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching footer data:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getContacts,
  getFooterData,
};

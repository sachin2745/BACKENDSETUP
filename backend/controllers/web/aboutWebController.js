const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const getAboutData = async (req, res) => {
  const aboutSql = `
    SELECT
      setting.settingId,
      setting.ourMissionImg1,
      setting.ourMissionImgAlt1,
      setting.ourMissionImg2,
      setting.ourMissionImgAlt2,
      setting.ourMissionImg3,
      setting.ourMissionImgAlt3,
      setting.ourMissionContent1,
      setting.ourMissionContent2,
      setting.ourMissionContent3,
      setting.ourMissionHeading,
      setting.ourMissionBgImg,
      setting.ourVisionHeading,
      setting.ourVisionBgImg,
      setting.ourVisionImg,
      setting.ourVisionImgAlt,
      setting.ourVisionContent1,
      setting.ourVisionContent2,
      setting.ourVisionContent3
    FROM setting  
    WHERE settingId = 1
  `;

  const founderSql = `
    SELECT * FROM founder
    WHERE founderStatus = 0 
    LIMIT 2 
  `;

  const pageSql = `
    SELECT * FROM pages  
    WHERE pageId = 3 AND pageStatus = 0
  `;

  try {
    // Execute both queries in parallel
    const [aboutRows] = await db.execute(aboutSql);
    const [founderRows] = await db.execute(founderSql);
    const [pageRows] = await db.execute(pageSql);

    // Check if footer data exists
    if (aboutRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No footer data information found." });
    }

    // Prepare the response with both footer and founder data
    const responseData = {
      aboutData: aboutRows[0], // Assuming settingId = 1 is unique
      founderData: founderRows.length > 0 ? founderRows : null, // Handle case if no founder data found
      pageData: pageRows[0], // Handle case if no founder data found
    };

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching about data:", err);
    return res.status(500).json({ error: err.message });
  }
};


const getAboutDetails = async (req, res) => {
  const aboutSql = `
    SELECT * FROM pages  
    WHERE pageId = 3 AND pageStatus = 0
  `;

  try {
    const [aboutRows] = await db.execute(aboutSql);

    // Check if header data exists
    if (aboutRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No about data information found." });
    }

    const responseData = {
      aboutData: aboutRows[0], 
    };

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching about data:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getAboutDetails,
  getAboutData,
};

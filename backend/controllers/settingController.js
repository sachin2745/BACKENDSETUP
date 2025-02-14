const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getSetting = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        setting.settingId, 
        setting.companyName,
        setting.companyLogo,
        setting.settingShortDescription, 
        setting.setttingLongDescription, 
        setting.facebookUrl, 
        setting.twitterUrl, 
        setting.linkedinUrl, 
        setting.youtubeUrl, 
        setting.instagramUrl, 
        setting.telegramUrl, 
        setting.whatsappNumber, 
        setting.callingNumber, 
        setting.googleUrl, 
        setting.intelUrl, 
        setting.appleUrl, 
        setting.windowsUrl, 
        setting.officialAddress, 
        setting.officialEmail, 
        setting.embedMapUrl,
        setting.fav180,
        setting.fav32,
        setting.fav16,
        setting.colorCouse,
        setting.colorCouseDetail,
        setting.gSeoDetail
        FROM setting
        WHERE settingId = 1`
    );

    if (rows.length > 0) {
      res.json(rows[0]); // Return the first row
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSetting = async (req, res) => {
  const data = {
    companyName: req.body.companyName,
    settingShortDescription: req.body.settingShortDescription,
    setttingLongDescription: req.body.setttingLongDescription,
    facebookUrl: req.body.facebookUrl,
    twitterUrl: req.body.twitterUrl,
    linkedinUrl: req.body.linkedinUrl,
    youtubeUrl: req.body.youtubeUrl,
    instagramUrl: req.body.instagramUrl,
    telegramUrl: req.body.telegramUrl,
    whatsappNumber: req.body.whatsappNumber,
    callingNumber: req.body.callingNumber,
    googleUrl: req.body.googleUrl,
    intelUrl: req.body.intelUrl,
    appleUrl: req.body.appleUrl,
    windowsUrl: req.body.windowsUrl,
    officialAddress: req.body.officialAddress,
    officialEmail: req.body.officialEmail,
    embedMapUrl: req.body.embedMapUrl,
    colorCouse: req.body.colorCouse,
    colorCouseDetail: req.body.colorCouseDetail,
    gSeoDetail: req.body.gSeoDetail,
    createdAt: Math.floor(Date.now() / 1000),
  };

  // Handle file uploads

  if (req.files.companyLogo) {
    const companyImg1Path = `/uploads/Setting/${req.files.companyLogo[0].filename}`;
    data.companyLogo = companyImg1Path;
  }

  if (req.files.fav180) {
    const favImg2Path = `/uploads/Setting/${req.files.fav180[0].filename}`;
    data.fav180 = favImg2Path;
  }

  if (req.files.fav32) {
    const favImg3Path = `/uploads/Setting/${req.files.fav32[0].filename}`;
    data.fav32 = favImg3Path;
  }

  if (req.files.fav16) {
    const favImg4Path = `/uploads/Setting/${req.files.fav16[0].filename}`;
    data.fav16 = favImg4Path;
  }

  try {
    // Update the record with id = 1
    await db.query("UPDATE setting SET ? WHERE settingId  = 1", [data]);
    res.status(200).send("General Details updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred");
  }
};

const getPageContent = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM pages WHERE aClientsPagesId = ?`,
      [1]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePageStatus = async (req, res) => {
  const pageId = req.params.id;
  const { pageStatus } = req.body;

  let query = "";
  const params = [];

  if (pageStatus !== undefined) {
    query = "UPDATE pages SET pageStatus = ? WHERE pageId  = ?";
    params.push(pageStatus, pageId);
  }

  if (!query) {
    return res.status(400).send("Invalid input: no fields to update.");
  }
  try {
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("Page not found.");
    } else {
      res.status(200).send("Page updated successfully.");
    }
  } catch (err) {
    console.error("Error updating page:", err);
    res.status(500).send("Error updating page.");
  }
};

const getPageById = async (req, res) => {
  const pageId = req.params.id;

  const [rows] = await db.query("SELECT * FROM pages WHERE pageId = ?", [
    pageId,
  ]);
  //  console.log("rows", rows)
  if (rows.length) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: "Page Content not found" });
  }
};

const updatePage = async (req, res) => {
  const pageId = req.params.id;

  const {
    pageTitle,
    pageDescription,
    metaTitle,
    metaDescriptioin,
    metaKeywords,
    metaSchema,
  } = req.body;

  const createdAt = Math.floor(Date.now() / 1000); // Unix timestamp

  await db.query(
    "UPDATE pages SET pageTitle = ?,pageDescription = ?, metaTitle = ?,metaDescriptioin =?, metaKeywords = ?,metaSchema = ?, createdAt = ? WHERE pageId = ?",
    [
      pageTitle,
      pageDescription,
      metaTitle,
      metaDescriptioin,
      metaKeywords,
      metaSchema,
      createdAt,
      pageId,
    ]
  );

  res.json({ success: "Page  Content updated successfully" });
};

const getEnquiryData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          enquiry.*, 
          enquiryremark.enquiryRemarkText AS newEnquiry,
          enquiryremark.enquiryRemarkDate 
      FROM enquiry 
      LEFT JOIN enquiryremark  
          ON enquiry.enquiryId = enquiryremark.enquiryRemarkRemarkId
          AND enquiryremark.enquiryRemarkDate = (
              SELECT MAX(er.enquiryRemarkDate) 
              FROM enquiryremark er
              WHERE er.enquiryRemarkRemarkId = enquiry.enquiryId
          )
      GROUP BY enquiry.enquiryId
      ORDER BY enquiry.enquiryId DESC;
  `);

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRemarkEnquiryData = async (req, res) => {
  try {
    const [rows] = await db.query(`
   SELECT 
    enquiryremark.*,
    users.userName AS enquiryRemarkAddedBy,
    enquiry.enquiryName AS enquiryName
    FROM enquiryremark
    LEFT JOIN enquiry ON enquiryremark.enquiryRemarkRemarkId = enquiry.enquiryId
    LEFT JOIN users ON enquiryremark.enquiryRemarkAddedBy = users.userId
    ORDER BY enquiryremark.enquiryRemarkId DESC;
  `);

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRemark = async (req, res) => {
  const { enquiryId, remark, enquiryRemarkAddedBy, enquiryRemarkDate } =
    req.body;

  if (
    !enquiryId ||
    !remark.trim() ||
    !enquiryRemarkAddedBy ||
    !enquiryRemarkDate
  ) {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  try {
    const query = `
      INSERT INTO enquiryremark (enquiryRemarkRemarkId, enquiryRemarkText, enquiryRemarkAddedBy, enquiryRemarkDate) 
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(query, [
      enquiryId,
      remark,
      enquiryRemarkAddedBy,
      enquiryRemarkDate,
    ]);

    return res
      .status(200)
      .json({ success: true, message: "Remark added successfully!" });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Failed to save remark" });
  }
};

module.exports = {
  getSetting,
  updateSetting,
  getPageContent,
  updatePageStatus,
  getPageById,
  updatePage,
  getEnquiryData,
  updateRemark,
  getRemarkEnquiryData,
};

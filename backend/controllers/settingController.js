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
    createdAt: Math.floor(Date.now() / 1000)
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

module.exports = {
  getSetting,
  updateSetting,
};

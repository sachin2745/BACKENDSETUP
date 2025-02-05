const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getMissionVision = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        setting.settingId, 
        setting.ourMissionHeading,
        setting.ourMissionBgImg,
        setting.ourMissionContent1, 
        setting.ourMissionImg1, 
        setting.ourMissionImgAlt1, 
        setting.ourMissionContent2, 
        setting.ourMissionImg2, 
        setting.ourMissionImgAlt2, 
        setting.ourMissionContent3, 
        setting.ourMissionImg3, 
        setting.ourMissionImgAlt3, 
        setting.ourVisionHeading, 
        setting.ourVisionBgImg, 
        setting.ourVisionImg, 
        setting.ourVisionImgAlt, 
        setting.ourVisionContent1, 
        setting.ourVisionContent2, 
        setting.ourVisionContent3
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

const updateMissionVision = async (req, res) => {
  const data = {
    ourMissionHeading: req.body.ourMissionHeading,
    ourMissionContent1: req.body.ourMissionContent1,
    ourMissionImgAlt1: req.body.ourMissionImgAlt1,
    ourMissionContent2: req.body.ourMissionContent2,
    ourMissionImgAlt2: req.body.ourMissionImgAlt2,
    ourMissionContent3: req.body.ourMissionContent3,
    ourMissionImgAlt3: req.body.ourMissionImgAlt3,
    ourVisionHeading: req.body.ourVisionHeading,
    ourVisionImgAlt: req.body.ourVisionImgAlt,
    ourVisionContent1: req.body.ourVisionContent1,
    ourVisionContent2: req.body.ourVisionContent2,
    ourVisionContent3: req.body.ourVisionContent3,
  };
  

  // Handle file uploads
 
  if (req.files.ourMissionImg1) {
    const missionImg1Path = `/uploads/ourMissionVision/${req.files.ourMissionImg1[0].filename}`;
    data.ourMissionImg1 = missionImg1Path;
  }
  
  if (req.files.ourMissionImg2) {
    const missionImg2Path = `/uploads/ourMissionVision/${req.files.ourMissionImg2[0].filename}`;
    data.ourMissionImg2 = missionImg2Path;
  }
  
  if (req.files.ourMissionImg3) {
    const missionImg3Path = `/uploads/ourMissionVision/${req.files.ourMissionImg3[0].filename}`;
    data.ourMissionImg3 = missionImg3Path;
  }
  
  if (req.files.ourVisionImg) {
    const visionImgPath = `/uploads/ourMissionVision/${req.files.ourVisionImg[0].filename}`;
    data.ourVisionImg = visionImgPath;
  }

  if (req.files.ourMissionBgImg) {
    const missionBgImgPath = `/uploads/ourMissionVision/${req.files.ourMissionBgImg[0].filename}`;
    data.ourMissionBgImg = missionBgImgPath;
  }
  if (req.files.ourVisionBgImg) {
    const visionImgBgPath = `/uploads/ourMissionVision/${req.files.ourVisionBgImg[0].filename}`;
    data.ourVisionBgImg = visionImgBgPath;
  }
  

  try {
    // Update the record with id = 1
    await db.query("UPDATE setting SET ? WHERE settingId  = 1", [data]);
    res.status(200).send("Details updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred");
  }
};

module.exports = {
  getMissionVision,
  updateMissionVision,
};

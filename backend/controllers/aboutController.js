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

const getFounder = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM founder`);

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

const updateFounderStatus = async (req, res) => {
  const founderId = req.params.id;
  const { founderSortBy, founderStatus } = req.body;

  let query = "";
  const params = [];

  try {
    // Build the query and parameters dynamically
    if (founderSortBy !== undefined) {
      query = "UPDATE founder SET founderSortBy = ? WHERE founderId = ?";
      params.push(founderSortBy, founderId);
    } else if (founderStatus !== undefined) {
      query = "UPDATE founder SET founderStatus = ? WHERE founderId = ?";
      params.push(founderStatus, founderId);
    } else {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Execute the query
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("Founder not found.");
    } else {
      res.status(200).send("Founder updated successfully.");
    }
  } catch (err) {
    console.error("Error updating founder:", err);
    res.status(500).send("Error updating founder.");
  }
};

const deleteFounder = async (req, res) => {
  const founderId = req.params.id;

  try {
    // Delete founder by ID
    const [result] = await db.execute(
      "DELETE FROM founder WHERE founderId  = ?",
      [founderId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Founder deleted successfully." });
    } else {
      res.status(404).json({ message: "Founder not found." });
    }
  } catch (error) {
    console.error("Error deleting founder:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addFounder = async (req, res) => {
  const {
    founderName,
    founderImgAlt,
    founderDsg,
    founderMsg,
    founderDetail,
    createdAt,
  } = req.body;

  // console.log(req.body);

  const founderImg = req.files?.founderImg?.[0]?.path
    ? `/uploads/Founder/${req.files.founderImg[0].filename}`
    : null;

  try {
    // Step 1: Get the maximum userId and calculate userSortBy
    const getMaxUserIdQuery = `SELECT MAX(founderId) AS maxUserId FROM founder`;
    const [maxUserIdResult] = await db.execute(getMaxUserIdQuery);

    const nextUserId = (maxUserIdResult[0].maxUserId || 0) + 1; // If no userId exists, start with 1
    const founderSortBy = nextUserId;

    // Step 2: Insert the new user with the calculated userSortBy
    const insertUserQuery = `
      INSERT INTO founder (founderName, founderImg, founderImgAlt, founderDsg, founderMsg, founderDetail, founderSortBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [insertResult] = await db.execute(insertUserQuery, [
      founderName,
      founderImg,
      founderImgAlt,
      founderDsg,
      founderMsg,
      founderDetail,
      founderSortBy,
      createdAt,
    ]);

    res.status(201).send({
      message: "Founder added successfully",
      founderId: insertResult.insertId,
    });
  } catch (err) {
    console.error("Error adding founder:", err);
    res.status(500).send({
      message: "Error adding founder",
      error: err.sqlMessage || err.message,
    });
  }
};

const getFounderById = async (req, res) => {
  const founderId = req.params.id;
  const query = "SELECT * FROM founder WHERE founderId  = ?";

  try {
    const [rows] = await db.execute(query, [founderId]); // Use execute for parameterized queries
    if (rows.length === 0) {
      return res.status(404).send({ message: "Founder not found" });
    }
    res.send(rows[0]);
  } catch (error) {
    console.error("Database query error:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching the founder" });
  }
};

const updateFounder = async (req, res) => {
  const founderId = req.params.id;
  const { founderName, founderImgAlt, founderDsg, founderMsg, founderDetail } =
    req.body;

  const founderImg = req.files?.founderImg?.[0]?.path
    ? `/uploads/Founder/${req.files.founderImg[0].filename}`
    : null;

  console.log(founderImg);

  let query = `
    UPDATE founder
    SET
      founderName = ?,
      founderImgAlt = ?,
      founderDsg = ?,
      founderMsg = ?,
      founderDetail = ?
  `;

  const params = [
    founderName,
    founderImgAlt,
    founderDsg,
    founderMsg,
    founderDetail,
  ];

  // Update founderImg only if a new image is uploaded
  if (founderImg) {
    query += `, founderImg = ?`;
    params.push(founderImg);
  }

  query += ` WHERE founderId = ?`;
  params.push(founderId);

  try {
    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Founder not found" });
    }
    res.send({ message: "Founder updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).send({ message: "Error updating founder" });
  }
};

const getBanner = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM aboutbanner WHERE bannerId = 1`
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

const updateBanner = async (req, res) => {
  const data = {
    bannerHeading: req.body.bannerHeading,
    bannerContent1: req.body.bannerContent1,
    bannerContent2: req.body.bannerContent2,
    bannerContent3: req.body.bannerContent3,
    bannerGoogle: req.body.bannerGoogle,
    bannerApple: req.body.bannerApple,
    bannerBgColor: req.body.bannerBgColor,
  };

  // Handle file uploads

  if (req.files.bannerImg) {
    const Img1Path = `/uploads/AboutBanner/${req.files.bannerImg[0].filename}`;
    data.bannerImg = Img1Path;
  }

  if (req.files.bannerTickIcon) {
    const Img2Path = `/uploads/AboutBanner/${req.files.bannerTickIcon[0].filename}`;
    data.bannerTickIcon = Img2Path;
  }

  try {
    // Update the record with id = 1
    await db.query("UPDATE aboutbanner SET ? WHERE bannerId  = 1", [data]);
    res.status(200).send("Details updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred");
  }
};

module.exports = {
  getMissionVision,
  updateMissionVision,
  getFounder,
  updateFounderStatus,
  deleteFounder,
  addFounder,
  getFounderById,
  updateFounder,
  getBanner,
  updateBanner,
};

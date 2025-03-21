const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller function to handle the users' data fetching
const getUsers = async (req, res) => {
  const sql =
    "SELECT * FROM users WHERE userStatus != 3 ORDER BY userSortBy ASC";

  try {
    // Execute the query using `db.execute` which returns a promise
    const [rows] = await db.execute(sql);
    return res.json(rows); // Return the fetched data as JSON
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const authenticateUsers = async (req, res) => {
  const { email, password } = req.body; // Get email and password from the request body

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Query the users table to find a matching email and password
    const result = await db.execute(
      "SELECT * FROM users WHERE userEmail = ? AND userPassword = ?",
      [email, password]
    );

    const rows = result[0]; // Access the rows (data) from the result

    // If a user is found
    // Check if rows is not undefined or null and has a length
    if (rows && rows.length > 0) {
      const user = rows[0]; // Get the first result (user)
      const { userId, userEmail, userName, userImage } = user;

      // Create a JWT token with user information
      const token = jwt.sign(
        { userId, userEmail }, // Payload: data to include in the token
        process.env.JWT_SECRET, // Secret key for signing the token
        { expiresIn: "3 days" } // Token expiration time
      );

      // Respond with the token and user details
      res.status(200).json({ token, userId, userEmail, userName, userImage });
    } else {
      // If no user is found, return a login failure response
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

const authorise = async (req, res) => {
  res.status(200).json({ allowed: true });
};

const updateStatus = async (req, res) => {
  const userId = req.params.id;
  const { userSortBy, userStatus } = req.body;

  let query = "";
  const params = [];

  try {
    // Build the query and parameters dynamically
    if (userSortBy !== undefined) {
      query = "UPDATE users SET userSortBy = ? WHERE userId = ?";
      params.push(userSortBy, userId);
    } else if (userStatus !== undefined) {
      query = "UPDATE users SET userStatus = ? WHERE userId = ?";
      params.push(userStatus, userId);
    } else {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Execute the query
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("User not found.");
    } else {
      res.status(200).send("User updated successfully.");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user.");
  }
};

const updatePopular = async (req, res) => {
  const userId = req.params.id;
  const { userPopular } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE users SET userPopular = ? WHERE userId = ?",
      [userPopular, userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send("User popularity status updated successfully.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user popularity status.");
  }
};

const addUser = async (req, res) => {
  const {
    userName,
    userEmail,
    userPassword,
    userMobile,
    userPopular,
    userStatus,
    userCreatedAt,
  } = req.body;

  const userImage = req.files?.userImage?.[0]?.path
    ? `/uploads/userImage/${req.files.userImage[0].filename}`
    : null;

  try {
    // Step 1: Get the maximum userId and calculate userSortBy
    const getMaxUserIdQuery = `SELECT MAX(userId) AS maxUserId FROM users`;
    const [maxUserIdResult] = await db.execute(getMaxUserIdQuery);

    const nextUserId = (maxUserIdResult[0].maxUserId || 0) + 1; // If no userId exists, start with 1
    const userSortBy = nextUserId;

    // Step 2: Insert the new user with the calculated userSortBy
    const insertUserQuery = `
      INSERT INTO users (userName, userImage, userEmail, userPassword, userMobile, userPopular, userSortBy, userStatus, userCreatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [insertResult] = await db.execute(insertUserQuery, [
      userName,
      userImage,
      userEmail,
      userPassword,
      userMobile,
      userPopular,
      userSortBy,
      userStatus,
      userCreatedAt,
    ]);

    res.status(201).send({
      message: "User added successfully",
      userId: insertResult.insertId,
    });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send({
      message: "Error adding user",
      error: err.sqlMessage || err.message,
    });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE userId = ?";

  try {
    const [rows] = await db.execute(query, [userId]); // Use execute for parameterized queries
    if (rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(rows[0]);
  } catch (error) {
    console.error("Database query error:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching the user" });
  }
};


const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    userName,
    userEmail,
    userPassword,
    userMobile,
    userPopular,
    userStatus,
  } = req.body;
  const userImage = req.files?.userImage?.[0]?.path
    ? `/uploads/userImage/${req.files.userImage[0].filename}`
    : null;

  console.log("req.file", req.file);

  let query = `
    UPDATE users
    SET
      userName = ?,
      userEmail = ?,
      userPassword = ?,
      userMobile = ?,
      userPopular = ?,
      userStatus = ?,
      userUpdatedAt = UNIX_TIMESTAMP()
  `;

  const params = [
    userName,
    userEmail,
    userPassword,
    userMobile,
    userPopular,
    userStatus,
  ];

  // Update userImage only if a new image is uploaded
  if (userImage) {
    query += `, userImage = ?`;
    params.push(userImage);
  }

  query += ` WHERE userId = ?`;
  params.push(userId);

  try {
    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).send({ message: "Error updating user" });
  }
};

module.exports = {
  getUsers,
  authenticateUsers,
  authorise,
  updateStatus,
  updatePopular,
  addUser,
  getUser,
  updateUser,
};

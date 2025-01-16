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
      res.status(200).json({ token, userEmail, userName, userImage });
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

module.exports = {
  getUsers,
  authenticateUsers,
};

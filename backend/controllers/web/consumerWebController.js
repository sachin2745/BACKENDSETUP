const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateConsumer = async (req, res) => {
  const { email, password } = req.body; // Get email and password from the request body

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Query the consumers table to find a matching email and password
    const result = await db.execute(
      "SELECT * FROM consumers WHERE consumerEmail = ? AND consumerPassword = ?",
      [email, password]
    );

    const rows = result[0]; // Access the rows (data) from the result

    // If a consumers is found
    // Check if rows is not undefined or null and has a length
    if (rows && rows.length > 0) {
      const user = rows[0]; // Get the first result (usconsumer)
      const { consumerId , consumerEmail, consumerName, consumerImage } = rows[0];

      // Create a JWT token with consumer information
      const token = jwt.sign(
        { consumerId, consumerEmail }, // Payload: data to include in the token
        process.env.JWT_SECRET, // Secret key for signing the token
        { expiresIn: "3 days" } // Token expiration time
      );

      // Respond with the token and consumer details
      res.status(200).json({ token, consumerId, consumerEmail, consumerName, consumerImage });
    } else {
      // If no consumer is found, return a login failure response
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

module.exports = {  
  authenticateConsumer,
  authorise,
};

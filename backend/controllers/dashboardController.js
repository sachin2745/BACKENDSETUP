const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getCounts = async (req, res) => {
  try {
    // Fetch counts from the tables
    const [blogs] = await db.query(
      "SELECT COUNT(*) AS count FROM blogs WHERE blogStatus != 3"
    );
    const [order] = await db.query(
      "SELECT COUNT(*) AS count FROM orderdetails"
    );
    const [consumers] = await db.query(
      "SELECT COUNT(*) AS count FROM consumers"
    );

    // console.log("blogs", blogs);
    // console.log("order", order);
    // console.log("users", users);

    // Send the response
    res.status(200).json({
      blogsCount: blogs[0].count,
      orderCount: order[0].count,
      consumersCount: consumers[0].count,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};

const getOrderHistoryData = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT orderhistory.opOrderId,
      storeproducts.productName,
      storeproducts.productThumbnail,
      storeproducts.productThumbnailAlt,
       orderdetails.*, orderhistory.*
       FROM orderhistory
       LEFT JOIN orderdetails ON orderhistory.opOrderId = orderdetails.orderId 
       LEFT JOIN storeproducts ON orderhistory.opProductId = storeproducts.productId      
       GROUP BY orderhistory.opOrderId
       ORDER BY orderhistory.orderHistoryId DESC
       LIMIT 5`
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No order history found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCounts,
  getOrderHistoryData,
};

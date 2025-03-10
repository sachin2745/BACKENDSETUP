const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getOrderHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT orderhistory.opOrderId, orderdetails.*, orderhistory.*
       FROM orderhistory
       LEFT JOIN orderdetails ON orderhistory.opOrderId = orderdetails.orderId       
       GROUP BY orderhistory.opOrderId
       ORDER BY orderhistory.orderHistoryId DESC`
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

const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId ) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    const [rows] = await db.execute(
      `SELECT * FROM orderdetails
          LEFT JOIN orderhistory ON orderdetails.orderId = orderhistory.opOrderId
          LEFT JOIN storeproducts ON orderhistory.opProductId = storeproducts.productId 
          WHERE orderdetails.orderId = ?`,
      [orderId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Invoice not found" });
    }

    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  getOrderHistory,
  getInvoice,
};

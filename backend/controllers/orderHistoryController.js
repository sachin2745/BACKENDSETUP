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

    if (!orderId) {
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

const setDeliveryDate = async (req, res) => {
  const { orderId, orderDeliveryTime } = req.body;

  if (!orderId || !orderDeliveryTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {   

    const [result] = await db.execute(
      "UPDATE orderhistory SET orderDeliveryTime = ? WHERE opOrderId  = ?",
      [orderDeliveryTime, orderId]
    );


    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "Order not found or not updated" });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database connection error" });
  }
};

module.exports = {
  getOrderHistory,
  getInvoice,
  setDeliveryDate,
};

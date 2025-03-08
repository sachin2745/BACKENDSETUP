const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const addAddress = async (req, res) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const orderConsumerId = decoded.consumerId; // Assuming JWT contains user ID

    const {
      name,
      phoneNumber,
      address,
      pincode,
      locality,
      city,
      state,
      cartDelTotal,
      cartTotal,
      orderStatus,
      orderPaymentType,
    } = req.body;

    const orderTime = Math.floor(Date.now() / 1000);

    const query = `
        INSERT INTO orderdetails 
        (orderConsumerId, orderName, orderMobile, orderBillingAddress, 
          odPincode, odLocality, odCity, odState, orderOriginalTotalAmount,orderDiscountTotalAmount,
         orderStatus, orderPaymentType, orderTime) 
        VALUES (?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      orderConsumerId,
      name,
      phoneNumber,
      address || "",
      pincode,
      locality,
      city,
      state,
      cartDelTotal,
      cartTotal,
      orderStatus || 1,
      orderPaymentType || 1,
      orderTime,
    ];

    const [result] = await db.execute(query, values);
    // console.log(result);
    res
      .status(200)
      .json({ message: "Order placed successfully", orderId: result.insertId });
  } catch (error) {
    // console.error("Error adding order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addOrder = async (req, res) => {
  const {
    consumer,
    items,
    details,
    intentId,
    shipping,
    orderId,
    cartTotal,
    cartDelTotal,
  } = req.body; // Get orderId from request

  if (!consumer || !items || !details || !intentId || !shipping || !orderId) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    for (const item of items) {
      await db.execute(
        `INSERT INTO orderhistory (opOrderId, opProductId, opOriginalPrice, opDiscountPrice, opQuantity, orderHistoryStatus, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, // Now using orderId from addAddress
          item.productId,
          item.delPrice,
          item.price,
          item.quantity,
          1, // Default status (New)
          Math.floor(Date.now() / 1000), // Unix timestamp for createdAt
        ]
      );
    }

    res.status(200).json({ message: "Order added successfully" });
  } catch (error) {
    console.error("Order insert error:", error);
    res.status(500).json({ message: "Error inserting order" });
  }
};

const getByUser = async (req, res) => {
  try {
    const consumerId = req.params.id;

    const query = `
      SELECT 
        oh.*, 
        sp.productName, 
        sp.productThumbnail, 
        sp.productThumbnailAlt, 
        sp.productTagLine, 
        od.*
      FROM orderHistory AS oh
      LEFT JOIN orderdetails AS od ON oh.opOrderId = od.orderId
      LEFT JOIN storeproducts AS sp ON oh.opProductId = sp.productId
      WHERE od.orderConsumerId = ?      
      GROUP BY od.orderId
      ORDER BY od.orderId DESC;
    `;

    const [rows] = await db.execute(query, [consumerId]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addAddress,
  addOrder,
  getByUser,
};

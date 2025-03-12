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

const updateOrderStatus = async (req, res) => {
  const { orderId, orderHistoryStatus } = req.body;

  if (!orderId || !orderHistoryStatus) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  try {
    const query = `UPDATE orderhistory SET orderHistoryStatus = ? WHERE opOrderId = ?`;
    const [result] = await db.execute(query, [orderHistoryStatus, orderId]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Order status updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

const getCoupon = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM coupen
      WHERE coupenStatus != 3
       ORDER BY couponSortBy ASC`
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Coupon not found" });
    }

    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error fetching Coupon:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const updateCouponStatus = async (req, res) => {
  const coupenId = req.params.id;
  const { couponSortBy, coupenStatus } = req.body;

  let query = "";
  const params = [];

  try {
    // Build the query and parameters dynamically
    if (couponSortBy !== undefined) {
      query = "UPDATE coupen SET couponSortBy = ? WHERE coupenId = ?";
      params.push(couponSortBy, coupenId);
    } else if (coupenStatus !== undefined) {
      query = "UPDATE coupen SET coupenStatus = ? WHERE coupenId = ?";
      params.push(coupenStatus, coupenId);
    } else {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Execute the query
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("Coupon not found.");
    } else {
      res.status(200).send("Coupon updated successfully.");
    }
  } catch (err) {
    console.error("Error updating Coupon:", err);
    res.status(500).send("Error updating Coupon.");
  }
};

const addCoupon = async (req, res) => {
  try {
    // Debug: Log request body to check incoming data
    // console.log("Request Body:", req.body);

    const {
      coupenCode,
      coupenDesc,
      coupenMinAmount,
      coupenMaximumAmt,
      coupenDiscountAmt,
      coupenType,
      coupenValidTill,
    } = req.body;

    // Step 1: Validate required fields
    if (
      !coupenCode ||
      !coupenDesc ||
      !coupenMinAmount ||
      !coupenDiscountAmt ||
      !coupenType ||
      !coupenValidTill
    ) {
      return res.status(400).send({
        message: "Missing required fields",
        error: "All required fields must be provided",
      });
    }

    // Step 2: Get the maximum coupenId and calculate couponSortBy
    const getMaxUserIdQuery = `SELECT MAX(coupenId) AS maxUserId FROM coupen`;
    const [maxUserIdResult] = await db.execute(getMaxUserIdQuery);
    const nextUserId = (maxUserIdResult[0].maxUserId || 0) + 1;
    const couponSortBy = nextUserId;

    // Step 3: Construct query dynamically
    let insertUserQuery = `
      INSERT INTO coupen (coupenCode, coupenDesc, coupenMinAmount, coupenDiscountAmt, coupenType, coupenValidTill, couponSortBy
    `;

    let values = [
      coupenCode,
      coupenDesc,
      coupenMinAmount,
      coupenDiscountAmt,
      coupenType,
      coupenValidTill,
      couponSortBy,
    ];

    if (coupenMaximumAmt !== undefined) {
      insertUserQuery += `, coupenMaximumAmt`;
      values.push(coupenMaximumAmt);
    }

    insertUserQuery += `) VALUES (${values.map(() => "?").join(", ")})`;

    // Step 4: Execute the query
    const [insertResult] = await db.execute(insertUserQuery, values);

    res.status(200).send({
      message: "Coupon added successfully",
      coupenId: insertResult.insertId,
    });
  } catch (err) {
    console.error("Error adding Coupon:", err);
    res.status(500).send({
      message: "Error adding Coupon",
      error: err.sqlMessage || err.message,
    });
  }
};

const getCouponById = async (req, res) => {
  const coupenId = req.params.id;
  const query = "SELECT * FROM coupen WHERE coupenId  = ?";

  try {
    const [rows] = await db.execute(query, [coupenId]); // Use execute for parameterized queries
    if (rows.length === 0) {
      return res.status(404).send({ message: "Coupen not found" });
    }
    res.send(rows[0]);
  } catch (error) {
    console.error("Database query error:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching the website Coupen" });
  }
};

const updateCoupon = async (req, res) => {
  const coupenId = req.params.id;
  const {
    coupenCode,
    coupenDesc,
    coupenMinAmount,
    coupenMaximumAmt,
    coupenDiscountAmt,
    coupenType,
    coupenValidTill,
  } = req.body;

  let query = `
    UPDATE coupen
    SET
      coupenCode = ?,
      coupenDesc = ?,
      coupenMinAmount = ?,
      coupenMaximumAmt = ?,
      coupenDiscountAmt = ?,
      coupenType = ?,
      coupenValidTill = ?
  `;

  const params = [coupenCode, coupenDesc, coupenMinAmount, coupenMaximumAmt, coupenDiscountAmt, coupenType, coupenValidTill];

  query += ` WHERE coupenId = ?`;
  params.push(coupenId);

  try {
    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Coupon not found" });
    }
    res.send({ message: "Coupon updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).send({ message: "Error updating Coupon" });
  }
};

module.exports = {
  getOrderHistory,
  getInvoice,
  setDeliveryDate,
  updateOrderStatus,
  getCoupon,
  updateCouponStatus,
  addCoupon,
  getCouponById,
  updateCoupon,
};

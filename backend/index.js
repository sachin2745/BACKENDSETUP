const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webRoutes = require("./routes/webRoutes");
const utilRouter = require("./routes/util");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "static/uploads")));

// Routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/web", webRoutes);
app.use("/util", utilRouter);

// Database connection
const db = require("./config/db");

// Stripe Payment Intent Creation
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, customerData } = req.body;

    if (!amount || !customerData || !customerData.email) {
      return res
        .status(400)
        .json({
          error: "Amount and valid customer data with email are required",
        });
    }

    console.log("Received Amount:", amount);

    // Check if the customer already exists
    let customerList = await stripe.customers.list({
      email: customerData.email,
      limit: 1,
    });
    let customer;

    if (customerList.data.length > 0) {
      customer = customerList.data[0]; // Use existing customer
      console.log("Existing Customer ID:", customer.id);
    } else {
      // Create a new customer if not found
      customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        address: customerData.address,
      });
      console.log("New Customer Created:", customer.id);
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: "inr",
      description: `Payment for ${customerData.name}`,
      customer: customer.id,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment Intent Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Retrieve Payment Intent
app.post("/retrieve-payment-intent", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment Intent ID is required" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    console.error("Retrieve Payment Intent Error:", error);
    res.status(500).json({ error: "Failed to retrieve payment intent" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.json("From Backend Side");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

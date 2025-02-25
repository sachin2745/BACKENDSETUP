const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getStore = async (req, res) => {
  const sql = `
    SELECT * FROM store        
    WHERE 
      storeId = 1
  `;

  try {
    // Execute the query for refund policy
    const [store] = await db.execute(sql);

    // Return the data as JSON
    return res.status(200).json({ store });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const getProducts = async (req, res) => {
  const sql = `
      SELECT * FROM storeproducts        
      WHERE 
        productStatus = 0
      ORDER BY productSortby ASC
    `;

  try {
    // Execute the query for refund policy
    const [products] = await db.execute(sql);

    // Return the data as JSON
    return res.status(200).json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
       * FROM  storeproducts     
      WHERE 
        productSlug LIKE  ?
    `,
      [`%${slug}%`]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCartProducts= async (req, res) => {
  try {
    const { productIds } = req.body; // Receive product IDs from frontend

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }

    const placeholders = productIds.map(() => "?").join(",");
    const query = `SELECT * FROM storeproducts WHERE productId IN (${placeholders})`;

    const [products] = await db.execute(query, productIds);
    res.json(products);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getStore,
  getProductBySlug,
  getProducts,
  getCartProducts,
};

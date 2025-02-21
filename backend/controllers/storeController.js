const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getStoreDetails = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM store
        WHERE storeId = 1`
    );

    if (rows.length > 0) {
      res.json(rows[0]); // Return the first row
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateStoreDetails = async (req, res) => {
  const data = {
    storeMetaTitle: req.body.storeMetaTitle,
    storeMetaDescription: req.body.storeMetaDescription,
    storeMetaKeyword: req.body.storeMetaKeyword,
    storeSchema: req.body.storeSchema,
    storeTitle: req.body.storeTitle,
    storeDescription: req.body.storeDescription,
    storeLongDescription: req.body.storeLongDescription,
    storeExpressAmt: req.body.storeExpressAmt,
    storeStandardAmt: req.body.storeStandardAmt,
    storeExpressDays: req.body.storeExpressDays,
    storeStandardDays: req.body.storeStandardDays,
  };

  try {
    // Update the record with id = 1
    await db.query("UPDATE store SET ? WHERE storeId  = 1", [data]);
    res.status(200).send("Details updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred");
  }
};

const getProductData = async (req, res) => {
  // SQL query to fetch blogs with joined categories
  const sql = `
        SELECT 
          *
        FROM 
          storeproducts          
        WHERE 
          productStatus != 3
        ORDER BY 
          productSortBy ASC
      `;

  // const categoriesSql = `
  //     SELECT
  //       *
  //     FROM
  //       blog_category
  //     WHERE
  //       blog_category_status != 3
  //     ORDER BY
  //       blog_category_id DESC
  //   `;

  try {
    // Execute the query for blogs
    const [products] = await db.execute(sql);

    // Execute the query for blog categories
    //   const [blogCategories] = await db.execute(categoriesSql);

    // Return the data as JSON
    return res.status(200).json({ products });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ error: err.message }); // Handle errors
  }
};

const updateStatus = async (req, res) => {
  const productId = req.params.id;
  const { productSortBy, productStatus, productStock } = req.body;

  let query = "";
  const params = [];

  try {
    // Build the query and parameters dynamically
    if (productSortBy !== undefined) {
      query = "UPDATE storeproducts SET productSortBy = ? WHERE productId = ?";
      params.push(productSortBy, productId);
    } else if (productStatus !== undefined) {
      query = "UPDATE storeproducts SET productStatus = ? WHERE productId = ?";
      params.push(productStatus, productId);
    } else if (productStock !== undefined) {
      query = "UPDATE storeproducts SET productStock = ? WHERE productId = ?";
      params.push(productStock, productId);
    } else {
      return res.status(400).send("No valid fields provided for update.");
    }

    // Execute the query
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      res.status(404).send("Product not found.");
    } else {
      res.status(200).send("Product updated successfully.");
    }
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product.");
  }
};

const updatePopular = async (req, res) => {
  const productId = req.params.id;
  const { productPopular } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE storeproducts SET productPopular = ? WHERE productId = ?",
      [productPopular, productId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send("Product popularity status updated successfully.");
    } else {
      res.status(404).send("Product not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product popularity status.");
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      productThumbnailAlt,
      productAlt2,
      productAlt3,
      productAlt4,
      productAlt5,
      productName,
      productTagLine,
      productDescription,
      prodStructure,
      prodHelp,
      ProductDetail,
      productOriginalPrice,
      productDiscountPrice,
      productSet,
      ProductEdition,
      productSlug,
      productRating,
      productStar,
      productMetaTitle,
      productMetaDescription,
      productKeywords,
      productSchema,
    } = req.body;

    // Save image
    const productThumbnail = req.files?.productThumbnail?.[0]?.path
      ? `/uploads/Products/${req.files.productThumbnail[0].filename}`
      : null;
    const productImg2 = req.files?.productImg2?.[0]?.path
      ? `/uploads/Products/${req.files.productImg2[0].filename}`
      : null;
    const productImg3 = req.files?.productImg3?.[0]?.path
      ? `/uploads/Products/${req.files.productImg3[0].filename}`
      : null;
    const productImg4 = req.files?.productImg4?.[0]?.path
      ? `/uploads/Products/${req.files.productImg4[0].filename}`
      : null;
    const productImg5 = req.files?.productImg5?.[0]?.path
      ? `/uploads/Products/${req.files.productImg5[0].filename}`
      : null;

    const productCreatedAt = Math.floor(Date.now() / 1000); // Unix timestamp

    const productSortBy = await db
      .query("SELECT MAX(productId) + 1 AS nextSort FROM storeproducts")
      .then(([rows]) => rows[0]?.nextSort || 1);

    // Insert data into storeproducts table
    const query = `
        INSERT INTO storeproducts (productThumbnail, productThumbnailAlt , productImg2, productAlt2, productImg3, productAlt3, productImg4,productAlt4, productImg5, productAlt5, productName, productTagLine, productDescription, prodStructure, prodHelp,ProductDetail,productOriginalPrice,productDiscountPrice,productSet, ProductEdition ,productSlug ,productRating ,productStar ,productMetaTitle ,productMetaDescription ,productKeywords ,productSchema ,productSortBy ,productCreatedAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
    const [result] = await db.execute(query, [
      productThumbnail,
      productThumbnailAlt,
      productImg2,
      productAlt2,
      productImg3,
      productAlt3,
      productImg4,
      productAlt4,
      productImg5,
      productAlt5,
      productName,
      productTagLine,
      productDescription,
      prodStructure,
      prodHelp,
      ProductDetail,
      productOriginalPrice,
      productDiscountPrice,
      productSet,
      ProductEdition,
      productSlug,
      productRating,
      productStar,
      productMetaTitle,
      productMetaDescription,
      productKeywords,
      productSchema,
      productSortBy,
      productCreatedAt,
    ]);

    res.status(200).json({
      message: "Product inserted successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting Product:", error);
    res.status(500).json({ message: "Error inserting Product" });
  }
};

const getProduct = async (req, res) => {
  const productId = req.params.id;

  const [rows] = await db.query(
    "SELECT * FROM storeproducts WHERE productId  = ?",
    [productId]
  );
  //  console.log("rows", rows)
  if (rows.length) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const {
    productThumbnailAlt,
    productAlt2,
    productAlt3,
    productAlt4,
    productAlt5,
    productName,
    productTagLine,
    productDescription,
    prodStructure,
    prodHelp,
    ProductDetail,
    productOriginalPrice,
    productDiscountPrice,
    productSet,
    ProductEdition,
    productSlug,
    productRating,
    productStar,
    productMetaTitle,
    productMetaDescription,
    productKeywords,
    productSchema,
  } = req.body;

  console.log(req.body);
  

  const productThumbnail = req.files?.productThumbnail?.[0]?.path
    ? `/uploads/Products/${req.files.productThumbnail[0].filename}`
    : null;
  const productImg2 = req.files?.productImg2?.[0]?.path
    ? `/uploads/Products/${req.files.productImg2[0].filename}`
    : null;
  const productImg3 = req.files?.productImg3?.[0]?.path
    ? `/uploads/Products/${req.files.productImg3[0].filename}`
    : null;
  const productImg4 = req.files?.productImg4?.[0]?.path
    ? `/uploads/Products/${req.files.productImg4[0].filename}`
    : null;
  const productImg5 = req.files?.productImg5?.[0]?.path
    ? `/uploads/Products/${req.files.productImg5[0].filename}`
    : null;

  let query =
    "UPDATE storeproducts SET productThumbnailAlt = ?, productAlt2 = ?, productAlt3 = ?, productAlt4 = ?, productAlt5 = ?, productName = ?, productTagLine = ?, productDescription = ?, prodStructure = ?, prodHelp = ?, ProductDetail = ?, productOriginalPrice = ?, productDiscountPrice = ?,productSet =?, ProductEdition =?, productSlug =?, productRating= ?, productStar = ?, productMetaTitle =?, productMetaDescription = ?, productKeywords = ?, productSchema = ?";
  const params = [
    productThumbnailAlt,
    productAlt2,
    productAlt3,
    productAlt4,
    productAlt5,
    productName,
    productTagLine,
    productDescription,
    prodStructure,
    prodHelp,
    ProductDetail,
    productOriginalPrice,
    productDiscountPrice,
    productSet,
    ProductEdition,
    productSlug,
    productRating,
    productStar,
    productMetaTitle,
    productMetaDescription,
    productKeywords,
    productSchema,
  ];

  // Update productThumbnail only if a new image is uploaded
  if (productThumbnail) {
    query += ", productThumbnail = ?";
    params.push(productThumbnail);
  }

  // Update productImg2 only if a new image is uploaded
  if (productImg2) {
    query += ", productImg2 = ?";
    params.push(productImg2);
  }

  // Update productImg3 only if a new image is uploaded
  if (productImg3) {
    query += ", productImg3 = ?";
    params.push(productImg3);
  }

  // Update productImg4 only if a new image is uploaded
  if (productImg4) {
    query += ", productImg4 = ?";
    params.push(productImg4);
  }

  // Update productImg5 only if a new image is uploaded
  if (productImg5) {
    query += ", productImg5 = ?";
    params.push(productImg5);
  }

  query += " WHERE productId = ?";
  params.push(productId);

  await db.query(query, params);

  res.json({ success: "Product updated successfully" });
};

module.exports = {
  getStoreDetails,
  updateStoreDetails,
  getProductData,
  updatePopular,
  updateStatus,
  addProduct,
  getProduct,
  updateProduct,
};

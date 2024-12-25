const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json()); 


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "products_db",
});


db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL!");
});


app.get("/", (req, res) => {
  res.send("API Ok");
});


app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Error fetching products");
    } else {
      res.json(results);
    }
  });
});


app.post("/products", (req, res) => {
  const { name, description, image_url, price, quantity } = req.body;

  if (!name || !description || !image_url || !price || !quantity) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    INSERT INTO products (name, description, image_url, price, quantity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(query, [name, description, image_url, price, quantity], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err);
      res.status(500).send("Error inserting product");
    } else {
      res.status(201).send("Product added successfully!");
    }
  });
});


app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, image_url, price, quantity } = req.body;

  if (!name || !description || !image_url || !price || !quantity) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    UPDATE products
    SET name = ?, description = ?, image_url = ?, price = ?, quantity = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(
    query,
    [name, description, image_url, price, quantity, id],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Error updating product");
      } else if (result.affectedRows === 0) {
        res.status(404).send("Product not found");
      } else {
        res.send("Product updated successfully!");
      }
    }
  );
});


app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM products
    WHERE id = ?
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Error deleting product");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Product not found");
    } else {
      res.send("Product deleted successfully!");
    }
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

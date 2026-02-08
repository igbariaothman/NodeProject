const express = require("express");
const router = express.Router();
const dbSingleton = require("../db/dbSingleton");

// Execute a query to the database
const db = dbSingleton.getConnection();

//show all favorites
router.get("/", (req, res) => {
  const { userId } = req.query;

  const query = `
    SELECT p.*
    FROM favorites f
    JOIN products p ON f.productId = p.id
    WHERE f.userId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//add favorit
router.post("/addfavorite", (req, res) => {
  const {userId , productId } = req.body;
  const query = "INSERT INTO favorites (userId , productId ) VALUES (? ,?)";
  db.query(query, [userId, productId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "Product added to favorites!", id: results.insertId });
  });
});

//delete favorites
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  const query = "DELETE FROM favorites WHERE id = ? AND userId = ?";
  db.query(query, [id, userId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or not yours" });
    }
    res.json({ message: "Product deleted successfully!" });
  });
});


module.exports = router;


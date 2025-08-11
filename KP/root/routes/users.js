const express = require("express");
const router = express.Router();

// Definisikan rute untuk pengguna
router.get("/", (req, res) => {
  res.send("User route");
});

module.exports = router;

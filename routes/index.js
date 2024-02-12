const express = require("express");

const app = express();

const router = express.Router();

router.get("/", (req, res) => {
  //   res.send("It works!");
  res.render("form");
});

module.exports = router;

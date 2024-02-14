const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const auth = require("http-auth");
const { check, validationResult } = require("express-validator");

const basic = auth.basic({
  file: path.join(__dirname, "../users.htpasswd"),
});

const app = express();

const router = express.Router();
const Registration = mongoose.model("Registration");

router.get("/", (req, res) => {
  //   res.send("It works!");
  res.render("form");
});

router.get(
  "/registrations",
  basic.check((req, res) => {
    Registration.find()
      .then((registrations) => {
        res.render("index", { title: "Listing registrations", registrations });
      })
      .catch(() => {
        res.send("Sorry! Something went wrong");
      });
  })
);

router.post(
  "/",
  [
    check().isLength({ min: 1 }).withMessage("Please enter a name"),
    check("email").isLength({ min: 1 }).withMessage("Please enter an email"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      // res.send("Thank you for your registration");
      const registration = new Registration(req.body);
      registration
        .save()
        .then(() => {
          res.send("Thank you for registration");
        })
        .catch((err) => {
          console.log(err);
          res.send("Sorry! Something went wrong");
        });
    } else {
      //   console.log(req.body);
      res.render("form", {
        title: "Registration form",
        error: errors.array(),
        data: req.body,
      });
    }
  }
);

module.exports = router;

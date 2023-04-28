const { check } = require("express-validator");

exports.signupUserValidator = [
  check("name", "Enter Full Name").isLength({ min: 5 }),
  check("password", "Password length is too small")
    .isLength({ min: 8 })
    .isString(),
  check("email", "Enter Valid email").isEmail(),
];

exports.loginUserValidator = [
  check("email", "Invalid Email").isEmail(),
  check("password", "Invalid Password").isLength({
    min: 8,
  }),
];

exports.getUserValidator = [
  check("authToken", "Unauthorised Access").exists().isLength({
    min: 90,
  }),
];

exports.routeSelectedValidator = [
  check("route", "Route not provided").exists(),
];

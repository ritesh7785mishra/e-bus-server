const { check } = require("express-validator");

exports.loginConductorValidator = [
  check("email", "Invalid Email").isEmail(),
  check("password", "Invalid Password").isLength({
    min: 8,
  }),
];

exports.getConductorValidator = [
  check("conductorAuthToken", "Unauthorised Access").exists().isLength({
    min: 90,
  }),
];

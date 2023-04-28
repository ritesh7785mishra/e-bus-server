const conductorModel = require("../models/conductorModel");
const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env;

//conductor login
module.exports.conductorLogin = async function conductorLogin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let data = req.body;

    if (data.email) {
      let conductor = await conductorModel.findOne({
        "properties.email": `${data.email}`,
      });

      if (conductor) {
        if (conductor.properties.password == data.password) {
          let cid = conductor["_id"];
          let token = jwt.sign({ payload: cid }, JWT_KEY);

          return res.json({
            message: "conductor logged in successfully",
            conductor: conductor,
            conductorAuthToken: token,
            success: true,
          });
        } else {
          res.json({
            message: "Wrong credentials",
            success: false,
          });
        }
      } else {
        res.json({
          message: "user not found",
          success: false,
        });
      }
    } else {
      res.json({
        message: "Please enter your email",
        success: false,
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
};

//protectConductorRoute

module.exports.protectConductorRoute = async function protectConductorRoute(
  req,
  res,
  next
) {
  try {
    let token = req.cookies.conductorLogin;
    if (token) {
      let payload = jwt.verify(token, JWT_KEY);
      if (payload) {
        const conductor = await conductorModel.findOne({ id: payload.payload });
        req.id = conductor.id;
        next();
      }
    } else {
      const client = req.get("User-Agent");
      if (client.includes("Mozilla") == true) {
      }
      res.json({
        message: "Please Login",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.conductorLogout = async function conductorLogout(req, res) {
  res.cookie("conductorLogin", "", { maxAge: 1 });
  res.json({
    message: "conductor logged out successfully",
  });
};

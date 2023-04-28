const locationModel = require("../models/locationModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { JWT_KEY } = process.env;

module.exports.getUser = async function getUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { authToken } = req.body;
  console.log("This is authToken int the backend", authToken);
  let payload = jwt.verify(authToken, JWT_KEY);

  if (payload) {
    const user = await userModel.findById(payload.payload);
    res.json({
      user,
      success: true,
    });
  } else {
    res.json({
      message: "user not found",
      success: false,
    });
  }
};

module.exports.updateUser = async function updateUser(req, res) {
  try {
    //updated data in users object
    let id = req.params.id;
    let user = await userModel.findById(id);
    let dataToBeUpdated = req.body;
    if (user) {
      const keys = [];
      for (let key in dataToBeUpdated) {
        keys.push(key);
      }

      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }
      const updatedData = await user.save(); //
      res.json({
        message: "data updated successfully",
        updatedData: updatedData,
        success: true,
      });
    } else {
      res.json({
        message: "user not found",
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

module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    if (user) {
      return res.json({
        message: "data deleted successfully",
        data: user,
        success: true,
      });
    } else {
      return res.json({
        message: "user not found",
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

module.exports.getAllBuses = async function getAllBuses(req, res) {
  try {
    let buses = await locationModel.find();
    if (buses) {
      res.json({
        message: "All active buses retreived successfully",
        data: buses,
        success: true,
      });
    } else {
      res.json({
        message: "no buses found",
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

module.exports.routeSelectedBuses = async function routeSelectedBuses(
  req,
  res
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let { route } = req.body;
    let allSelectedBuses = await locationModel.find({ currentRoute: route });
    if (allSelectedBuses) {
      res.json({
        message: "buses retreived successfully",
        data: allSelectedBuses,
        success: true,
      });
    } else {
      res.json({
        message: "not able to find buses",
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

const conductorModel = require("../models/conductorModel");
const locationModel = require("../models/locationModel");
const jwt = require("jsonwebtoken");
const { apiKey, adminKey, baseUrl, JWT_KEY } = process.env;

const { validationResult } = require("express-validator");

//getConductor Profile

module.exports.getConductorProfile = async function getConductorProfile(
  req,
  res
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let { conductorAuthToken } = req.body;

    let payload = jwt.verify(conductorAuthToken, JWT_KEY);

    if (payload) {
      const conductor = await conductorModel.findById(payload.payload);
      console.log("This function called,", payload.payload);
      console.log("This is founded conductor", conductor);
      res.json({
        name: conductor.name,
        conductorId: conductor.properties.conductorId,
        id: conductor.id,
        success: true,
      });
    } else {
      res.json({
        message: "conductor not found",
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

//get the updated Route by the conductor
module.exports.updateConductorRoute = async function updateConductorRoute(
  req,
  res
) {
  try {
    const { id, currentRoute } = req.body;

    const updateRoute = await locationModel.findOneAndUpdate(
      { id: id },
      { $set: { currentRoute: currentRoute } },
      { new: true }
    );

    if (updateRoute) {
      res.json({
        message: "updated Route successfully",
        data: updateRoute,
        success: true,
      });
    } else {
      res.json({
        message: "not able to update Route",
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

//get current location of the conductor
module.exports.addCurrentLocation = async function addCurrentLocation(
  req,
  res
) {
  try {
    const { id, longlat } = req.body;
    const updateRoute = await locationModel.findOneAndUpdate(
      { id: id },
      { $set: { currentLocation: longlat } },
      { new: true }
    );

    if (updateRoute) {
      res.json({
        message: "route updated Successfully",
        data: updateRoute,
        success: true,
      });
    } else {
      res.json({
        message: "not able to update route in locationModel",
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

//udpate seatStatus
module.exports.seatStatusUpdate = async function seatStatusUpdate(req, res) {
  try {
    const seatStatus = req.body.seatStatus;
    const id = req.body.id;
    const updateSeatStatus = await locationModel.findOneAndUpdate(
      { id: id },
      { $set: { seatStatus: seatStatus } },
      { new: true }
    );

    if (updateSeatStatus) {
      res.json({
        message: "Seat status updated successfully",
        success: true,
      });
    } else {
      res.json({
        message: "not able to update seat status",
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

//signout from the location service

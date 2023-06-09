const express = require("express");
const {
  protectConductorRoute,
  conductorLogin,
  conductorLogout,
} = require("../controllers/conductorAuthController");

const {
  updateConductorRoute,
  addCurrentLocation,
  getConductorProfile,
  seatStatusUpdate,
} = require("../controllers/conductorController");

const {
  loginConductorValidator,
  getConductorValidator,
} = require("../validators/conductorValidator");
const conductorRouter = express.Router();

conductorRouter
  .route("/conductor-login")
  .post(loginConductorValidator, conductorLogin);
conductorRouter
  .route("/conductor-profile")
  .post(getConductorValidator, getConductorProfile);
// conductorRouter.use(protectConductorRoute);
// conductorRouter.route("/conductor-profile").get(getConductorProfile);

conductorRouter.route("/update-current-route").patch(updateConductorRoute);
conductorRouter.route("/update-location").patch(addCurrentLocation);
conductorRouter.route("/update-seat-status").patch(seatStatusUpdate);
conductorRouter.route("/logout").get(conductorLogout);

module.exports = conductorRouter;

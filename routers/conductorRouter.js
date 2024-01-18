const express = require("express");
// const {
//   protectConductorRoute,
//   conductorLogin,
//   conductorLogout,
// } = require("../controllers/conductorAuthController");

const {
	updateConductorRoute,
	addCurrentLocation,
	seatStatusUpdate,
	conductorLogin,
	getConductor,
} = require("../controllers/conductorController");
const authMiddleware = require("../middleware");

const conductorRouter = express.Router();

conductorRouter.route("/auth/login").post(conductorLogin);
conductorRouter.route("/profile").get(authMiddleware, getConductor);

conductorRouter.route("/update-current-route").patch(updateConductorRoute);
conductorRouter.route("/update-location").patch(addCurrentLocation);
conductorRouter.route("/update-seat-status").patch(seatStatusUpdate);

module.exports = conductorRouter;

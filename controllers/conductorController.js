const conductorModel = require("../models/conductorModel");
const locationModel = require("../models/locationModel");
const jwt = require("jsonwebtoken");
const { apiKey, adminKey, baseUrl, JWT_KEY } = process.env;
const bcrypt = require("bcrypt");
const { createToken } = require("../utility/utility");

async function conductorLogin(req, res) {
	try {
		const { email, password } = req.body;
		const conductor = await conductorModel.findOne({ email });
		if (conductor) {
			console.log(password, conductor.password);
			const match = await bcrypt.compare(password, conductor.password);

			if (match) {
				const token = createToken(conductor._id);

				return res.json({
					msg: "conductor logged in successfully",
					token,
					success: true,
				});
			} else {
				return res.json({
					msg: "invalid credentials",
					success: false,
				});
			}
		} else {
			return res.json({
				msg: "invalid credentials",
				success: false,
			});
		}
	} catch (error) {
		console.log(error.message, "conductor login error");
	}
}

//getConductor Profile
async function getConductor(req, res) {
	try {
		const id = req.userId;
		console.log("req.userId", id);
		const conductor = await conductorModel.findById(id);
		if (conductor) {
			res.json({
				msg: "here is your conductor data",
				success: true,
				conductor,
			});
		} else {
			res.json({
				msg: "not able to found conductor",
				success: false,
			});
		}
	} catch (error) {
		console.log(error.message);
	}
}

//get the updated Route by the conductor
async function updateConductorRoute(req, res) {
	try {
		const id = req.userId;
		const { currentRoute } = req.body;

		console.log("this is called", currentRoute);

		const updateRoute = await locationModel.findOneAndUpdate(
			{ conductor_id: id },
			{ $set: { currentRoute: currentRoute } },
			{ new: true }
		);

		console.log(updateRoute);

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
		console.log(error.message);
		res.json({
			message: error.message,
			success: false,
		});
	}
}

//get current location of the conductor
async function addCurrentLocation(req, res) {
	try {
		const id = req.userId;
		const { longlat } = req.body;
		const updatedLocation = await locationModel.findOneAndUpdate(
			{ id: id },
			{ $set: { currentLocation: longlat } },
			{ new: true }
		);

		if (updatedLocation) {
			res.json({
				message: "location updated Successfully",
				data: updatedLocation,
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
}

//udpate seatStatus
async function seatStatusUpdate(req, res) {
	try {
		const id = req.userId;
		const { seatStatus } = req.body;
		const updateSeatStatus = await locationModel.findOneAndUpdate(
			{ conductor_id: id },
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
}

module.exports = {
	updateConductorRoute,
	addCurrentLocation,
	seatStatusUpdate,
	conductorLogin,
	getConductor,
};

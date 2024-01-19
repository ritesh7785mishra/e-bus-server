const locationModel = require("../models/locationModel");
const userModel = require("../models/userModel");

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { createToken, hashPassword } = require("../utility/utility");

async function addUser(req, res) {
	try {
		const data = req.body;

		if (data) {
			const { email, password } = data;

			const alreadyUser = await userModel.findOne({ email });

			if (alreadyUser) {
				return res.json({
					msg: "this user is already present",
				});
			}

			const hash = await hashPassword(password);

			const user = await userModel.create({ ...data, password: hash });

			const token = await createToken(user._id);
			console.log(user, token);
			if (user) {
				res.json({
					success: true,
					data: user,
					token,
				});
			}
		} else {
			res.json({
				success: false,
				message: "req body not correct",
			});
		}
	} catch (error) {
		res.json({
			success: false,
			error: error.message,
		});
	}
}

async function userLogin(req, res) {
	try {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email });
		if (user) {
			console.log(password, user.password);
			const match = await bcrypt.compare(password, user.password);

			if (match) {
				const token = createToken(user._id);

				return res.json({
					msg: "user logged in successfully",
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
		console.log(error.message, "user login error");
	}
}

async function getUser(req, res) {
	try {
		const id = req.userId;
		console.log("req.userId", id);
		const user = await userModel.findById(id);
		if (user) {
			res.json({
				msg: "here is your user data",
				success: true,
				user,
			});
		} else {
			res.json({
				msg: "not able to found user",
				success: false,
			});
		}
	} catch (error) {
		console.log(error.message);
	}
}
async function updateUser(req, res) {
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
}

async function deleteUser(req, res) {
	try {
		const id = req.userId;
		console.log("req.userId", id);
		const user = await userModel.findByIdAndDelete(id);
		if (user) {
			res.json({
				msg: "Your id deleted  successfully",
				success: true,
				user,
			});
		} else {
			res.json({
				msg: "not able to found user",
				success: false,
			});
		}
	} catch (error) {
		console.log(error.message);
	}
}

async function getAllBuses(req, res) {
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
}

async function routeSelectedBuses(req, res) {
	try {
		let { route } = req.body;
		let routeSelectedBuses = await locationModel.find({ currentRoute: route });
		if (routeSelectedBuses) {
			res.json({
				message: "buses retreived successfully",
				data: routeSelectedBuses,
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
}

module.exports = {
	addUser,
	userLogin,
	getUser,
	updateUser,
	deleteUser,
	getAllBuses,
	routeSelectedBuses,
};

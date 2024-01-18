const conductorModel = require("../models/conductorModel");
const { apiKey, adminKey, baseUrl } = process.env;
const axios = require("axios");
const locationModel = require("../models/locationModel");
const { hashPassword, createToken } = require("../utility/utility");
const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");

async function addAdmin(req, res) {
	try {
		const data = req.body;

		if (data) {
			const { password } = data;
			const hash = await hashPassword(password);

			const admin = await adminModel.create({ ...data, password: hash });

			const token = await createToken(admin._id);
			console.log(admin, token);
			if (admin) {
				res.json({
					success: true,
					data: admin,
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

//admin login
async function adminLogin(req, res) {
	try {
		const { email, password } = req.body;
		const admin = await adminModel.findOne({ email });
		if (admin) {
			console.log(password, admin.password);
			const match = await bcrypt.compare(password, admin.password);

			if (match) {
				const token = createToken(admin._id);

				return res.json({
					msg: "admin logged in successfully",
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
		console.log(error.message, "admin login error");
	}
}

async function getAdmin(req, res) {
	try {
		const id = req.userId;
		console.log("req.userId", id);
		const admin = await adminModel.findById(id);
		if (admin) {
			res.json({
				msg: "here is your admin data",
				success: true,
				admin,
			});
		} else {
			res.json({
				msg: "not able to found admin",
				success: false,
			});
		}
	} catch (error) {
		console.log(error.message);
	}
}

async function getAdmins(req, res) {
	try {
		const id = req.userId;
		const admin = await adminModel.findById(id);
		if (admin.role.includes("superAdmin")) {
			const allAdmins = await adminModel.find();
			res.json({
				success: true,
				data: allAdmins,
			});
		} else {
			res.json({
				success: false,
				msg: "you are not super admin",
			});
		}
	} catch (error) {
		res.json({
			success: false,
			error: error.message,
		});
	}
}

async function deleteAdmin(req, res) {
	try {
		const id = req.params.id;
		if (id) {
			const deletedAdmin = await adminModel.findByIdAndDelete(id);
			if (deletedAdmin) {
				res.json({
					success: true,
					data: deletedAdmin,
				});
			} else {
				res.json({
					success: false,
					message: "not able to create deletedAdmin",
				});
			}
		} else {
			res.json({
				success: false,
				message: "not able to find id",
			});
		}
	} catch (error) {
		res.json({
			success: false,
			error: error.message,
		});
	}
}

//adding conductor to the list
async function addConductor(req, res) {
	try {
		let data = req.body;
		// console.log("This is data ", dataObj);

		// const response = await axios
		// 	.post(
		// 		`https://api.tomtom.com/locationHistory/1/objects/object?key=${apiKey}&adminKey=${adminKey}`,
		// 		{
		// 			...dataObj,
		// 		},
		// 		{
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 		}
		// 	)
		// 	.catch((err) => {
		// 		console.log(err.message);
		// 	});

		// let data = await response.data;

		if (data) {
			let hash = await hashPassword(data.password);

			let conductor = await conductorModel.create({ ...data, password: hash });

			let locationData = await locationModel.create({
				conductor_id: conductor._id,
			});

			if (conductor) {
				res.json({
					message: "Conductor Added Successfully",
					data: conductor,
					location: locationData,
					success: true,
				});
			} else {
				res.json({
					message: "Not able to create conductor in conductorModel",
					success: false,
				});
			}
		} else {
			res.json({
				message: "not able to create conductor in tom tom api",
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

//get a conductor data
async function getConductor(req, res) {
	const id = req.params.id;
	try {
		let conductor = await conductorModel.findById(id);
		// console.log(conductor);

		if (conductor) {
			res.json({
				message: "conductor retreived successfully",
				data: conductor,
				success: true,
			});
		} else {
			res.json({
				message: "conductor details not found",
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

//deleting a conductor.
async function deleteConductor(req, res) {
	try {
		const id = req.params.id;

		if (id) {
			const deletedConductor = await conductorModel.findByIdAndDelete(id);

			const deletedLocation = await locationModel.findOneAndDelete({
				conductor_id: id,
			});

			if (deletedConductor) {
				res.json({
					message: "conductor deleted Successfully",
					data: deletedConductor,
					lastLocation: deletedLocation,
					success: true,
				});
			} else {
				res.json({
					message: "conductor not found",
					success: false,
				});
			}
		}
	} catch (error) {
		res.json({
			message: error.message,
			success: false,
		});
	}
}

//updating conductor data
//in update section only add properties.
async function updateConductor(req, res) {
	try {
		const updatedData = req.body;
		let id = req.params.id;
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedData),
		};
		const response = await fetch(
			`https://${baseUrl}/locationHistory/1/objects/${id}?key=${apiKey}&adminKey=${adminKey}`,
			requestOptions
		);
		const data = await response.json();

		if (data) {
			const updatedDataInMongoDb = await conductorModel.findOneAndUpdate(
				{ id: id },
				{ ...updatedData },
				{ new: true }
			);

			res.json({
				message: "data updated Successfully",
				data: updatedDataInMongoDb,
				success: true,
			});
		} else {
			res.json({
				message: "id not found in mongoDb",
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

//getting all the conductors
async function getAllConductor(req, res) {
	try {
		let allConductors = await conductorModel.find();
		if (allConductors) {
			res.json({
				message: "All conductors data retreived Successfully",
				data: allConductors,
				success: true,
			});
		} else {
			res.json({
				message: "conductors not found",
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
	addAdmin,
	adminLogin,
	deleteAdmin,
	getAdmins,

	getAllConductor,
	updateConductor,
	deleteConductor,
	getConductor,
	addConductor,
	getAdmin,
};

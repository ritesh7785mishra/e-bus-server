const mongoose = require("mongoose");

const { db_link } = process.env;

mongoose
	.connect(db_link)
	.then((db) => {
		console.log("admin database connected");
	})
	.catch((e) => {
		console.log("Error admin database connection", e.message);
	});

const adminSchema = new mongoose.Schema({
	profile_img: {
		type: String,
		trim: true,
		default: "/img/defaultProfile.jpg",
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	contact_no: {
		type: Number,
		required: true,
		trim: true,
	},
	aadhar_no: {
		type: Number,
	},
	created_by: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: [
			{
				type: String,
				enum: ["admin", "superAdmin"],
				default: ["admin"],
			},
		],
	},
});

const adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;

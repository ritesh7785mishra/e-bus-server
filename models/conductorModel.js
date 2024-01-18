const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const { db_link } = process.env;
const emailValidator = require("email-validator");

mongoose
	.connect(db_link)
	.then((db) => {
		console.log("conductor data base connected");
	})
	.catch((err) => {
		console.log(err.message);
	});

const conductorSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	govt_id: {
		type: String,
		required: true,
	},
	aadhar_no: {
		type: Number,
		required: true,
	},
	contact_no: {
		type: Number,
		required: true,
	},
	profile_img: {
		type: String,
		default: "img/users/default.jpeg",
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		trim: true,
	},
});

const conductorModel = mongoose.model("conductorModel", conductorSchema);

module.exports = conductorModel;

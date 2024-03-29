const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const { db_link } = process.env;

mongoose
	.connect(db_link)
	.then((db) => {
		console.log("location database connected");
	})
	.catch((err) => {
		console.log(err.message);
	});

const locationSchema = mongoose.Schema({
	conductor_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ConductorModel",
	},
	currentRoute: {
		type: String,
		default: "All Kanpur",
	},
	currentLocation: {
		type: Array,
		default: [0, 0],
	},
	seatStatus: {
		type: String,
		default: "Empty",
	},
});

const locationModel = mongoose.model("locationModel", locationSchema);

module.exports = locationModel;

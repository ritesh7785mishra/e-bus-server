// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const adminModel = require("./models/adminModel");
const { apiKey } = process.env;

const authMiddleware = async (req, res, next) => {
	const token = req.header("Authorization");

	console.log("req", req.body);
	console.log("token", token);

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, apiKey);
		console.log("decoded", decoded);
		req.userId = decoded._id;
		next();
	} catch (error) {
		console.log(error.message);
		res.status(401).json({ message: "Token is not valid" });
	}
};

module.exports = authMiddleware;

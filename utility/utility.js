const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.apiKey, { expiresIn: "3d" });
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

module.exports = { createToken, hashPassword };

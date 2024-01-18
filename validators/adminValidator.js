const Joi = require("joi");

const adminValidationSchema = require("./schema");

module.exports = async function validateAdmin(req, res, next) {
	const data = req.body;
	const { error } = adminValidationSchema.validate({ ...data });

	if (error) {
		const msg = error.details.map((error) => error.message).join(",");
		res.json({
			success: false,
			validationError: msg,
		});
	}

	next();
};

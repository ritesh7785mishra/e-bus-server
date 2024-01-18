const Joi = require("joi");

const adminValidationSchema = Joi.object({
	profile_img: Joi.string(),
	email: Joi.string().required(),
	name: Joi.string().required(),
	contact_no: Joi.number().required(),
	aadhar_no: Joi.number().required(),
	role: Joi.array().required(),
	created_by: Joi.string().required(),
	password: Joi.string().required(),
});

module.exports = adminValidationSchema;

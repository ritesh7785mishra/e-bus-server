const express = require("express");
const adminRouter = express.Router();

const {
	getAllConductor,
	addConductor,
	deleteConductor,
	updateConductor,
	getConductor,
	addAdmin,
	getAdmins,
	getSuperAdmins,
	deleteAdmin,
	adminLogin,
	getAdmin,
} = require("../controllers/adminController");

const adminValidator = require("../validators/adminValidator");
const authMiddleware = require("../middleware");

//admin ke options

adminRouter.route("/auth/login").post(adminLogin);

// adminRouter.use(authMiddleware);

adminRouter.route("/add-admin").post(adminValidator, authMiddleware, addAdmin);
// adminRouter.use(authMiddleware);
adminRouter.route("/admin-profile").get(authMiddleware, getAdmin);

adminRouter.route("/all-admin").get(authMiddleware, getAdmins);

adminRouter.route("/delete/:id").delete(authMiddleware, deleteAdmin);

//for fetching all the conductors
adminRouter.route("/all-conductor").get(getAllConductor);
//getting a single conductor
adminRouter.route("/conductor-profile/:id").get(getConductor);
//adding conductor to the list
adminRouter.route("/add-conductor").post(addConductor);

//delete conductor from the list
adminRouter.route("/delete-conductor/:id").delete(deleteConductor);
//update conductor data.
// adminRouter.route("update-conductor/:id").patch(updateConductor);

module.exports = adminRouter;

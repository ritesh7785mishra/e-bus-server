const express = require("express");
const {
	getUser,
	deleteUser,
	routeSelectedBuses,
	getAllBuses,
	addUser,
	userLogin,
} = require("../controllers/userController");
const authMiddleware = require("../middleware");

const userRouter = express.Router();

userRouter.route("/signup").post(addUser);
userRouter.route("/auth/login").post(userLogin);
userRouter.use(authMiddleware);
userRouter.route("/profile").get(getUser);
userRouter.route("/all-buses").get(getAllBuses);
userRouter.route("/route-selected-buses").post(routeSelectedBuses);
userRouter.route("/delete").delete(deleteUser);

module.exports = userRouter;

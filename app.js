const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const adminRouter = require("./routers/adminRouter");
const conductorRouter = require("./routers/conductorRouter");
const userRouter = require("./routers/userRouter");
const bodyParser = require("body-parser");

const { frontendUrl } = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: frontendUrl,
  })
);
app.listen(3000);

app.use("/admin", adminRouter);
app.use("/conductor", conductorRouter);
app.use("/user", userRouter);

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const adminRouter = require("./routers/adminRouter");
const conductorRouter = require("./routers/conductorRouter");
const userRouter = require("./routers/userRouter");

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:5173", "https://e-savari.netlify.app"],
	})
);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Set the destination folder for uploaded files
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
	try {
		if (!req.file) {
			throw new Error("No file uploaded");
		}

		// Access the uploaded file using req.file
		const imagePath = req.file.path;

		// You can save the file path to the database or perform other actions

		res.send("File uploaded successfully");
	} catch (error) {
		console.error("Error uploading file:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.use("/admin", adminRouter);
app.use("/conductor", conductorRouter);
app.use("/user", userRouter);

// Use process.env.PORT if available, otherwise default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

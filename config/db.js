const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const db = async () => {
	try {
		const MONGO_URL = await process.env.MONGO_URL;
		console.log("MONGO_URL", MONGO_URL);
		const con = await mongoose.connect(MONGO_URL);
		console.log(`MongoDB connected on ${con.connection.host}`);
	} catch (error) {
		console.error(error);
	}
};
module.exports = db;

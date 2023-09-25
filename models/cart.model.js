const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const CartSchema = new mongoose.Schema({
	productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
	quantity: { type: Number, required: true },
});

module.exports = mongoose.model("Cart", CartSchema);

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const subSchema = new mongoose.Schema({
	productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
	discountAmount: { type: Number, required: true },
	minQuantity: { type: Number, required: true },
	maxQuantity: { type: Number, required: true },
});

const DiscountSchema = new mongoose.Schema({
	product: [subSchema],
	isDefaultDiscount: { type: Boolean, required: true },
	minCartValue: { type: Number, required: true },
	minCartValueDiscount: Number,
});

module.exports = mongoose.model("Discount", DiscountSchema);

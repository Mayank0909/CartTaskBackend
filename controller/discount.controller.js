const Discount = require("../models/discount.model");

exports.listDiscount = async (req, res) => {
	const discount = await Discount.find();
	res.json(discount);
};

exports.addDiscount = async (req, res) => {
	const { product, isDefaultDiscount, minCartValue, minCartValueDiscount } =
		req.body;

	const discount = new Discount({
		product: product,
		isDefaultDiscount: isDefaultDiscount,
		minCartValue: minCartValue,
		minCartValueDiscount: minCartValueDiscount,
	});
	await discount.save();

	res.json({ message: "Discount added successfully" });
};

exports.patchDiscount = async (req, res) => {
	const { discountId, discountPercentage, minQuantity, minCartValue } =
		req.body;

	// Find the Discount object with the given ID.
	const discount = await Discount.findById(discountId);

	discount.product[0].discountPercentage = discountPercentage;
	discount.product[0].minQuantity = minQuantity;
	discount.minCartValue = minCartValue;

	// Save the Discount object to the database.
	await discount.save();

	// Send a success response.
	res.status(200).json({ message: "Discount updated successfully" });
};

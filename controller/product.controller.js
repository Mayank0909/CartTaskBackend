const Product = require("../models/product.model");

exports.listProducts = async (req, res) => {
	const products = await Product.find();
	res.json(products);
	// console.log(products);
};

exports.addProduct = async (req, res) => {
	const { name, price, description, imgUrl } = req.body;

	const newProduct = new Product({
		name,
		price,
		description,
		imgUrl,
	});

	await newProduct.save();

	res.json({ message: "Product added successfully" });
};

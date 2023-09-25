const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Discount = require("../models/discount.model");

exports.addItemToBasket = async (req, res) => {
	const { productId, quantity } = req.body;
	const cartItem = await Cart.find({ productId: productId });
	let cart;
	if (cartItem.length) {
		cart = cartItem[0];
		cart.quantity += quantity;
		await cart.save();
	} else {
		cart = new Cart({
			productId,
			quantity,
		});
		await cart.save();
	}

	res.json(cart);
};
exports.removeItem = async (req, res) => {
	const { id } = req.params;
	console.log(id, "gdjhjdhdghdghj");

	const cartItem = await Cart.findOneAndRemove({ productId: id });
	if (!cartItem) {
		return res.status(404).json({ message: "Cart item not found" });
	}

	res.json({
		status: 200,
		message: "Cart item removed successfully",
	});
};
exports.getBasket = async (req, res) => {
	const { couponId } = req.query;
	let discount;
	if (couponId) {
		discount = await Discount.findById(couponId).populate({
			path: "product",
			populate: { path: "productId" },
		});
	} else {
		const data = await Discount.find({ isDefaultDiscount: true }).populate({
			path: "product",
			populate: { path: "productId" },
		});
		if (data) discount = data[0];
	}

	const cart = await Cart.find().populate("productId");
	const productDiscount = discount?.product;
	const updatedPriceCart = cart.map((cartItem) => {
		const [productDetails] = productDiscount?.filter((e) => {
			return String(e.productId._id) === String(cartItem.productId._id);
		});
		if (productDetails) {
			if (cartItem.quantity >= productDetails.minQuantity) {
				const quantityOnDiscount = Math.floor(
					cartItem.quantity / productDetails.minQuantity
				);
				const totalDiscountedAmount =
					productDetails.discountAmount * quantityOnDiscount;
				const totalDiscountedPrice =
					productDetails.productId.price * cartItem.quantity -
					totalDiscountedAmount;

				const product = {
					cartItem: cartItem,
					totalItemPrice: cartItem.productId.price * cartItem.quantity,
					totalDiscountedAmount: totalDiscountedAmount,
					totalDiscountedPrice: totalDiscountedPrice,
				};
				return product;
			} else {
				const product = {
					cartItem: cartItem,
					totalItemPrice: cartItem.productId.price * cartItem.quantity,
				};
				return product;
			}
		} else {
			const product = {
				cartItem: cartItem,

				totalItemPrice: cartItem.productId.price * cartItem.quantity,
			};

			return product;
		}
	});

	let totalPrice = 0,
		totalItemDiscount = 0;
	totalDiscountedPriceAfterMinCartValue = 0;
	totalDiscountedPrice = 0;
	updatedPriceCart.forEach((e) => {
		if (e?.totalDiscountedPrice) {
			totalDiscountedPrice += e?.totalDiscountedPrice;
			totalPrice += e?.totalItemPrice;
			totalItemDiscount += e?.totalDiscountedAmount;
		} else {
			totalPrice += e?.totalItemPrice;

			totalDiscountedPrice += e?.totalItemPrice;
		}
	});

	console.log(
		"totalDiscountedPrice  discount.minCartValue",
		totalDiscountedPrice,
		discount.minCartValue
	);
	if (totalDiscountedPrice >= discount.minCartValue) {
		totalDiscountedPriceAfterMinCartValue =
			totalDiscountedPrice - discount.minCartValueDiscount;
	}

	const updatedData = {
		data: updatedPriceCart,
		totalPrice: totalPrice,
		totalItemDiscountAmount: totalItemDiscount,
		totalPriceAfterItemDiscount: totalDiscountedPrice,
		minCartValueDiscount: discount.minCartValueDiscount,
		totalDiscountedPrice: totalDiscountedPriceAfterMinCartValue,
	};

	res.json(updatedData);
};

exports.getTotalPriceAndDiscounts = async (req, res) => {
	const cart = await Cart.findOne();

	// Populate the product in the cart with data from the product list.
	for (const item of cart.items) {
		const product = await Product.findById(item.productId);
		item.product = product;
	}

	let totalDiscount = 0;
	for (const item of cart.items) {
		// Calculate the discount for the item, taking into account the minimum quantity.
		let discount = 0;
		if (item.quantity >= item.product.minQuantity) {
			discount = item.product.discount * item.quantity;
		}

		totalDiscount += discount;
	}

	let totalPrice = cart.items.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);
	totalPrice -= totalDiscount;

	// Apply additional cart discount if the total cart price is over Rs 150
	if (totalPrice > 150) {
		totalPrice -= 20;
	}

	res.json({ totalPrice, totalDiscount });
};

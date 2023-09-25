const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productController = require("./controller/product.controller");
const basketController = require("./controller/cart.controller");
const discountController = require("./controller/discount.controller");

const app = express();
const dotenv = require("dotenv");
const db = require("./config/db");
db();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8000;

app.get("/api/products", productController.listProducts);
app.post("/api/products", productController.addProduct);
app.post("/api/basket/add-item", basketController.addItemToBasket);
app.get("/api/basket", basketController.getBasket);
app.delete("/api/basket/:id", basketController.removeItem);
app.get("/api/discount/", discountController.listDiscount);
app.post("/api/discount", discountController.addDiscount);
app.get(
	"/api/basket/:id/total-price-and-discounts",
	basketController.getTotalPriceAndDiscounts
);

app.listen(8000, () => {
	console.log("Server is listening");
});

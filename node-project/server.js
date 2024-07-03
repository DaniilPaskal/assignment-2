const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const expressInstance = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { setUncaughtExceptionCaptureCallback } = require("process");

// Create express instance and server
const express = new expressInstance();
const server = http.createServer(express);

// Tell router to find static files, parse urlencoded, parse JSON data, and allow requests from other domains
express.use(expressInstance.static('public'));
express.use(bodyParser.urlencoded({ extended: true }));
express.use(bodyParser.json());
express.use(cors());

// Listen on port 8080
server.listen(8080, '0.0.0.0', function() {
    console.log("Server running");
})



/* Database */

// Connect to database
mongoose.connect('mongodb+srv://dpaskal0409:Mz7yzBryOt5JOoaf@cluster0.bpvsgim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

var Schema = mongoose.Schema;



/* Collections */

// Product schema and model
var productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
		image: String,
        description: String,
        cost: Number,
        shippingCost: Number,
		rating: Number
    }
)
var Product = mongoose.model("products", productSchema);

// User schema and model
var userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true
        },
		password: String,
        address: String,
        province: String,
        purchaseHistory: Array
    }
)
var User = mongoose.model("users", userSchema);

// Comment schema and model
var commentSchema = new Schema(
    {
        product: Product,
        user: User,
        rating: Number,
		text: String,
        images: Array
    }
)
var Comment = mongoose.model("comments", commentSchema);

// Cart schema and model
var cartSchema = new Schema(
    {
        products: Array,
        quantities: Array,
        user: User,
    }
)
var Cart = mongoose.model("carts", cartSchema);

// Order schema and model
var orderSchema = new Schema(
    {
        user: User,
        cost: Number,
        date: Date,
    }
)
var Order = mongoose.model("orders", orderSchema);



/* Database API endpoints */

// Add product to database
express.post('/add_product', async function(req, res) {
    const { name, image, description, cost, shippingCost } = req.body;
    const product = new Product({ name: name, image: image, description: description, cost: cost, shippingCost: shippingCost, rating: 0 });
	
    product.save().then(() => {
        console.log(`${product.name} has been saved in the database.`);
    }).catch(err => {
        console.log(`Error saving ${product.name}.`);
    });
});

// Get products in database
express.get('/get_products', async function(req, res) {
    Product.find()
        .sort({})
        .exec()
        .then((products) => {
            console.log(products);
            res.send(products);
        });
});

// Add user to database
express.post('/register', async function(req, res) {
    const { name, email, password } = req.body;
    const user = new User({ name: name, email: email, password: password, purchaseHistory: [] });
	const cart = new Cart({ user: user, products: [], quantities: [] })

    // Create user
    user.save().then(() => {
        console.log(`${user.name} has been saved in the database.`);
    }).catch(err => {
        console.log(`Error saving ${user.name}.`);
    });

    // Create user's cart
    cart.save();
});

// Retrieve user from database
express.get('/login', async function(req, res) {
    const { email } = req.body;

    User.findOne({ 'email': email }, 'password')
        .exec()
        .then((user) => {
            console.log(user);
            res.send(user);
        });
});

// Update user in database
express.put('/update_user', async function(req, res) {
	const { name, email, password, address, province } = req.body;
	
    User.updateOne({ email: email }, { $set: { rating: rating, email: email, password: password, address: address, province: province } })
		.exec()
		.then(() => {
			console.log(`Updated ${name}`);
		})
		.catch((err) => {
			onsole.log(`Failed to update ${name}.`);
		});
});

// Delete user from database
express.delete('/delete_user', async function (req, res) {
	const { email } = req.params.name;
	
    User.deleteOne({ email: email })
        .exec()
		.then(() => {
			console.log(`Deleted user with email ${email}`);
		})
		.catch((err) => {
			console.log(`Failed to delete user with email ${email}}.`);
		});
});

// Add comment
express.post('/comment', async function(req, res) {
    const { product, user, rating, text, images } = req.body;
    const comment = new Comment({ product: product, user: user, rating: rating, text: text, images: images });
	
    comment.save().then(() => {
        console.log(`Comment saved in the database.`);
    }).catch(err => {
        console.log(`Error saving comment.`);
    });
});

// Get comments for product
express.get('/get_comments', async function(req, res) {
    const { product } = req.body;

    Product.find({ 'product': product })
        .exec()
        .then((comments) => {
            res.send(comments);
        });
});

// Update cart
express.put('/update_cart', async function(req, res) {
    const { user } = req.body;

    Cart.updateOne({ user: user }, { $set: { } })
    .exec()
    .then(() => {
        console.log(`Updated ${user.name}'s cart.`);
    })
    .catch((err) => {
        onsole.log(`Failed to update ${user.name}'s cart.`);
    });
});

// Create order
express.post('/order', async function(req, res) {
    const { user } = req.body;

    // Reset user's cart
    Cart.updateOne({ user: user }, { $set: { products: [], quantities: [] } })
    .exec();

    // Record user's order
    Order.save({ user: user })
    .exec();
});
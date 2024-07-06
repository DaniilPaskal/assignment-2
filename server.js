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
mongoose.connect('mongodb+srv://dpaskal0409:Mz7yzBryOt5JOoaf@cluster0.bpvsgim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { dbName: "store" });

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
        name: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
		password: String,
        address: String,
        province: String,
        purchaseHistory: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Product' 
        }]
    }
)
var User = mongoose.model("users", userSchema);

// Comment schema and model
var commentSchema = new Schema(
    {
        product: { 
            type: Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },
        rating: Number,
		text: String,
        images: [String]
    }
)
var Comment = mongoose.model("comments", commentSchema);

// Cart schema and model
var cartSchema = new Schema(
    {
        products: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Product',
        }],
        quantities: [Number],
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User',
            unique: true
        }
    }
)
var Cart = mongoose.model("carts", cartSchema);

// Order schema and model
var orderSchema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },
        cost: Number,
        date: Date,
    }
)
var Order = mongoose.model("orders", orderSchema);



/* Database API endpoints */

    /* Products */

// Add product to database
express.post('/add-product', async function(req, res) {
    const { name, image, description, cost, shippingCost } = req.body;
    const product = new Product({ name: name, image: image, description: description, cost: cost, shippingCost: shippingCost, rating: 0 });
	
    product.save().then(() => {
        res.send(`${product.name} has been saved in the database.`);
    }).catch(err => {
        res.send(`Error saving ${product.name}.`);
    });
});

// Get products in database
express.get('/get-products', async function(req, res) {
    Product.find()
        .sort({})
        .exec()
        .then((products) => {
            res.send(products);
        });
});

// Update product in database
express.put('/update-product', async function(req, res) {
	const { name, image, description, cost, shippingCost } = req.body;
	
    Product.updateOne({ name: name }, { $set: { image: image, description: description, cost: cost, shippingCost: shippingCost } })
		.exec()
		.then(() => {
			res.send(`Updated ${name}.`);
		})
		.catch((err) => {
			res.send(`Failed to update ${name}.`);
		});
});

// Delete product from database
express.delete('/delete-product', async function (req, res) {
	const { name, productId } = req.body;
	
    // Delete product
    Product.deleteOne({ name: name })
        .exec()
		.then(() => {
			res.send(`Deleted product named ${name}.`);

            // Delete product comments
            Comment.deleteMany({ product: productId })
                .exec();
		})
		.catch((err) => {
			res.send(`Failed to delete product named ${name}}.`);
		});
});

// Update product rating
express.put('/update-rating', async function(req, res) {
    const { product } = req.body;
    var ratingSum = 0;
    var ratingCount = 0;
    var rating = 0;

    // Find all comments for product and get sum and count of ratings
    await Comment.find({ product: product }, "rating")
        .exec()
        .then((comments) => {
            comments.map((comment) => {
                ratingSum += comment.rating;
                ratingCount++;
            });
        }).catch(err => {
            res.send(`Error loading comments.`);
            return;
        });

    // Calculate average rating from sum and count
    rating = ratingSum / ratingCount;

    // Update rating
    Product.updateOne({ _id: product }, { $set: { rating: rating } })
        .exec()
        .then(() => {
            res.send(`Rating has been updated to ${rating}.`);
        }).catch(err => {
            res.send(`Error updating product.`);
        });
});

    /* Users */

// Add user to database
express.post('/register', async function(req, res) {
    const { name, email, password, address, province } = req.body;
    const user = new User({ name: name, email: email, password: password, address: address, province: province, purchaseHistory: [] });
	const cart = new Cart({ user: user, products: [], quantities: [] })

    // Create user
    user.save().then(() => {
        res.send(`${user.name} has been saved in the database.`);

        // Create user's cart
        cart.save();
    }).catch(err => {
        res.send(`Error saving ${user.name}.`);
    });
});

// Check if user with given email and password combination exists
express.get('/login', async function(req, res) {
    const { email, password } = req.body;

    User.findOne({ email: email, password: password })
        .exec()
        .then((user) => {
            if (user) {
                res.send("User authenticated.");
            } else {
                res.send("User not found.");
            }
        });
});

// Update user in database
express.put('/update-user', async function(req, res) {
	const { name, email, password, address, province } = req.body;
	
    User.updateOne({ email: email }, { $set: { name: name, password: password, address: address, province: province } })
		.exec()
		.then(() => {
			res.send(`Updated ${name}.`);
		})
		.catch((err) => {
			res.send(`Failed to update ${name}.`);
		});
});

// Delete user from database
express.delete('/delete-user', async function (req, res) {
	const { email, userId } = req.body;
	
    // Delete user
    User.deleteOne({ email: email })
        .exec()
		.then(() => {
			res.send(`Deleted user with email ${email}.`);

            // Delete user's cart
            Cart.deleteOne({ user: userId })
                .exec();
		})
		.catch((err) => {
			res.send(`Failed to delete user with email ${email}}.`);
		});
});

    /* Comments */

// Add comment
express.post('/comment', async function(req, res) {
    const { product, user, rating, text, images } = req.body;
    const comment = new Comment({ product: product, user: user, rating: rating, text: text, images: images });
    
    comment.save()
        .then(() => {
            res.send(`Comment saved in the database.`);
        }).catch(err => {
            res.send(`Error saving comment. ${product}`);
        });
});

// Get comments for product
express.get('/get-comments', async function(req, res) {
    const { product } = req.body;

    Comment.find({ product: product })
        .exec()
        .then((comments) => {
            res.send(comments);
        }).catch(err => {
            res.send(`Error loading comments.`);
        });
});

    /* Cart */

// Get cart
express.get('/get-cart', async function(req, res) {
    const { userId } = req.body;

    Cart.findOne({ user: userId })
        .exec()
        .then((cart) => {
            res.send(cart);
        }).catch(err => {
            res.send(`Error loading cart.`);
        });
})

// Update cart
express.put('/update-cart', async function(req, res, next) {
    const { user, product, quantity } = req.body;
    var products = [];
    var quantities = [];
    var index;

    // Get existing cart products and quantities
    await Cart.findOne({ user: user }, "products quantities")
        .exec()
        .then((cart) => {
            if (cart) {
                products = cart.products;
                quantities = cart.quantities;
            }
        })
        .catch((err) => {
            next(err);
        })

    // Check if product in cart
    index = products.indexOf(product);
    if (index >= 0) {
        // If product in cart, update existing quantity
        quantities[index] = quantity;
    } else {
        // If product not in cart, add new product and quantity
        products.push(product);
        quantities.push(quantity);
    }

    Cart.updateOne({ user: user }, { $set: { products: products, quantities: quantities } })
        .exec()
        .then(() => {
            res.send(`Updated cart.`);
        })
        .catch((err) => {
            res.send(`Failed to update cart.`);
        });
});

    /* Order */

// Create order
express.post('/order', async function(req, res, next) {
    const { email, userId } = req.body;
    const date = new Date();
    var products = [];
    var quantities = [];
    var purchaseHistory = [];
    var totalCost = 0;

    // Get user purchase history
    await User.findOne({ email: email }, "_id purchaseHistory")
        .exec()
        .then((user) => {
            if (user) {
                purchaseHistory = user.purchaseHistory.slice();
            }
        }).catch(err => {
            next(err);
        });

    // Get products and quantities in cart
    await Cart.findOne({ user: userId }, "products quantities")
        .exec()
        .then((cart) => {
            if (cart) {
                products = cart.products.slice();
                quantities = cart.quantities.slice();
            }
        }).catch(err => {
            next(err);
        });

    // Iterate through products
    for (var i = 0; i < products.length; i++) {
        var cost, shippingCost = 0;

        // If product not in purchasing history, add to history
        if (!purchaseHistory.indexOf(products[i])) {
            purchaseHistory.push(products[i]);
        }

        // Get product cost and shipping cost
        await Product.findOne({ _id: products[i] }, "cost shippingCost")
            .exec()
            .then((product) => {
                if (product) {
                    cost = product.cost;
                    shippingCost = product.shippingCost;
                }
            })

        // Add product cost multiplied by product quantity to total cost
        totalCost += (cost * quantities[i]) + shippingCost;
    }

    // Update user purchase history
    User.updateOne({ email: email }, { $set: { purchaseHistory: purchaseHistory } })
        .exec()
        .catch(err => {
            next(err);
        });

    // Reset user's cart
    Cart.updateOne({ user: userId }, { $set: { products: [], quantities: [] } })
        .exec()
        .catch(err => {
            next(err);
        });

    // Create order
    const order = new Order({ user: userId, cost: totalCost, date: date });

    // Record user's order
    order.save()
        .then(() => {
            res.send(`Recorded order.`);
        })
        .catch(err => {
            res.send(`Error recording order.`);
        });
});
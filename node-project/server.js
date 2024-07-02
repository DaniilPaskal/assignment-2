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
        price: Number,
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
        purchaseHistory: {
            type: Array,
            default: []
        }
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
        images: {
            type: Array,
            default: []
        }
    }
)
var Comment = mongoose.model("comments", commentSchema);

// Cart schema and model
var cartSchema = new Schema(
    {
        products: {
            type: Array,
            default: []
        },
        quantities: {
            type: Array,
            default: []
        },
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



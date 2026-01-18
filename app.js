// Import required modules
const express = require("express"); // Express framework for Node.js
const app = express(); // Create an Express application
const mysql = require("mysql"); // MySQL module for database interaction
const bodyParser = require("body-parser"); // To parse form POST data

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from "public" directory

// Set view engine
app.set("view engine", "ejs"); // Use EJS templates instead of plain HTML

// Configure MySQL database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "g00474347"
});

// Establish connection with the database
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
    } else {
        console.log("Connected to database!");
    }
});

// Hardcoded valid credentials for demonstration purposes
const VALID_EMAIL = "user@123.com";
const VALID_PASSWORD = "pass";

// START OF ROUTES

// POST login form - route to process login data
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // If credentials match, render checkout page; otherwise, re-render login with error
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        res.render("checkout", { error: null }); // Successful login, render checkout.ejs
    } else {
        res.render("login", { error: "Invalid email or password, please try again" }); // Error mesage displayed
    }
});

// Handle GET requests to the home page
app.get("/", (req, res) => {
    // An array containing filenames of images used on homepage - images stored in /public/images
    const carouselImages = ["carousel1.jpg", "carousel2.jpg", "carousel3.jpg", "carousel4.jpg"];
    const shuffled = (arr) => {
        // Create a copy of the array so the original is not modified
        const a = arr.slice();

        // Loop through the array from the end to the beginning
        for (let i = a.length - 1; i > 0; i--) {

            // Generate a random index between 0 and i
            const j = Math.floor(Math.random() * (i + 1));

            // Swap the elements at positions i and j
            [a[i], a[j]] = [a[j], a[i]];
        }
        // Return the shuffled array
        return a;
    };

    // Shuffle the carousel images so the first slide is different on each page load
    const images = shuffled(carouselImages);

    // Separate the first image (active image) from the rest
    const firstImage = images[0];
    const restImages = images.slice(1);

    // Render the homepage, passing the first image and the rest to EJS template
    res.render("index", { firstImage, restImages });
});

// Handle GET requests to the /login page
// Error variable is passed to the template for displaying error messages - here it is null as user has not submitted form yet
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// GET /shop route
app.get("/shop", function (req, res) {
    // Get the product ID from the query string
    const ID = req.query.rec;

    if (!ID) {
        // No ID = show all products
        connection.query("SELECT * FROM products", function (err, rows) {
            // Handle any errors during the database query
            if (err) {
                console.error("Error retrieving products:", err);
                return res.status(500).send("Error retrieving products from database");
            }

            // Render shop.ejs with all products
            res.render("shop.ejs", { products: rows });
        });
        return;
    }

    // If an ID is provided = show single product page
    connection.query("SELECT * FROM products WHERE ID = ?", [ID], function (err, rows) {
        if (err) {
            console.error(`Error retrieving product ID ${ID}:`, err);
            return res.status(500).send("Error retrieving product from database");
        }
        // If no product found with the given ID, return 404
        if (rows.length === 0) {
            console.error(`No product found for ID ${ID}`);
            return res.status(404).send(`No product found for ID ${ID}`);
        }

        // Render product.ejs with the product details from the database
        const product = rows[0];
        res.render("product.ejs", {
            title: product.title,
            description: product.description,
            price: product.price,
            myImage: product.image
        });
    });
});

// GET /contact route
app.get("/contact", function (req, res) {
    res.render("contact"); // Render form.ejs for the /form route
});

// GET /checkout route
app.get("/checkout", function (req, res) {
    res.render("login", { error: null }); // Render login.ejs for the /checkout route
});

// POST /summary route
app.post("/summary", function (req, res) { // Render summary.ejs for the /summary route
    res.render("summary", { // Pass form data to the summary template
        name: req.body.name,
        address: req.body.address,
        payment: req.body.payment
    });
});

// END ROUTES

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000"); // Log message when server starts successfully
});
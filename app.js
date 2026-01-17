// Import required modules
const express = require("express"); // Express framework for Node.js
const app = express(); // Create an Express application
const mysql = require('mysql'); // MySQL module for database interaction
const bodyParser = require("body-parser"); // To parse form POST data

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from 'public' directory

// Set view engine
app.set("view engine", "ejs"); // Use EJS templates instead of plain HTML

// Configure MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'g00474347'
});

// Establish connection with the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
    } else {
        console.log('Connected to database!');
    }
});

// Hardcoded valid credentials for demonstration purposes
const VALID_EMAIL = "user@123.com";
const VALID_PASSWORD = "pass";

// START OF ROUTES
// Route to handle login form submission
// POST login form
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        res.render("checkout", { error: null }); // no error - render checkout
    } else {
        res.render("login", { error: "Invalid email or password, please try again" }); // re-render login with error
    }
});

// Handle GET requests to the home page
app.get('/', (req, res) => {

    // An array containing filenames of images used on homepage
    // These images are stored in the public/images folder
    const carouselImages = ['carousel1.jpg', 'carousel2.jpg', 'carousel3.jpg', 'carousel4.jpg'];
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

    // Shuffle the carouselImages array
    // The first image will be different on each page load
    const images = shuffled(carouselImages);

    // Simplified: send the first image separately and the rest in an array
    const firstImage = images[0];
    const restImages = images.slice(1);

    // Render the index.ejs template and pass the simplified data
    res.render('index', { firstImage, restImages }); // Render index.ejs with first and rest images
});

// Handle GET requests to the /login page
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.get("/shop", function (req, res) {
    const ID = req.query.rec;

    if (!ID) {
        // No ID = show all products
        connection.query("SELECT * FROM products", function (err, rows) {
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
        if (rows.length === 0) {
            console.error(`No product found for ID ${ID}`);
            return res.status(404).send(`No product found for ID ${ID}`);
        }

        const product = rows[0];
        res.render("product.ejs", {
            title: product.title,
            description: product.description,
            price: product.price,
            myImage: product.image
        });
    });
});

app.get("/contact", function (req, res) {
    res.render("form.ejs"); // Render form.ejs for the /form route
});

app.get("/checkout", function (req, res) {
    res.render("login.ejs", { error: null }); // Render login.ejs for the /checkout route
});

// END ROUTES

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000'); // Log message when server starts successfully
});
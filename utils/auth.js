// Authentication utility functions - custom Node.js module

// Hardcoded valid credentials for demonstration purposes
const VALID_EMAIL = "user@123.com";
const VALID_PASSWORD = "pass";

// Function to validate login credentials
function validateLogin(email, password) {
    return email === VALID_EMAIL && password === VALID_PASSWORD;
}

// Export the validateLogin function for use in other files
module.exports = { validateLogin };
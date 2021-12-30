const express = require("express");
const path = require("path");
const router = express.Router();

// Google Books API Helper
const booksApi = require(path.join(__dirname, "..", "helpers", "booksApi"));

// Routes of the main pages
const routes = {  // Separated by -> route: [filename, ejs-render]
    "/": ["home", "Home"],
    "/categories": ["categories", "Categories"],
    "/popular": ["most-popular", "Most Popular"],
    "/recent": ["most-recent", "Most Recent"]
}

// Rendering of the main pages (home, categories, popular and recent)
for (let route in routes) {
    router.get(route, async (req, res) => {
        let books = await booksApi.getBooksData("lord+of+the+rings");  // Change later...
        res.render(routes[route][0], {sectionTitle: routes[route][1], books});
    });
};

// 404 http status response
router.use((req, res, next) => {
    res.status(404).render("page-not-found")
});


module.exports = router;

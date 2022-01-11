const express = require('express');

const router = express.Router();

// Google Books API Helper
const booksApi = require('../helpers/booksApi');

// Routes of the main pages
const routes = { // Separated by -> route: [filename, ejs-render]
    '/': ['home', 'Home'],
    '/categories': ['categories', 'Categories'],
    '/popular': ['most-popular', 'Most Popular'],
    '/recent': ['most-recent', 'Most Recent'],
};

// Rendering of the main pages (home, categories, popular and recent)
for (let index = 0; index < Object.keys(routes).length; index += 1) {
    const route = Object.keys(routes)[index];
    router.get(route, async (req, res) => {
        const books = await booksApi.getHomeBooks();
        res.render(routes[route][0], { sectionTitle: routes[route][1], books });
    });
}

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

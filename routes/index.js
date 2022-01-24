const express = require('express');

const router = express.Router();

// Google Books API Helper
const booksApi = require('../helpers/booksApi');

// Routes of the main pages
router.get('/', async (req, res) => { // Home route
    try {
        const homeBooks = await booksApi.getHomeBooks();
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('home', {
            sectionTitle: 'Home', homeBooks, latestBooks,
        });
    } catch (err) { // In case there's an error, no books will be displayed
        res.status(429).render('page-not-found');
    }
});

router.get('/popular', async (req, res) => { // Popular Books route
    // Checks the popular section's page
    let page = parseInt(req.query.page) || 1;
    if (page < 1 || typeof (page) !== 'number') page = 1;

    try {
        const popularBooks = await booksApi.getPopularBooks(page);
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('most-popular', {
            sectionTitle: 'Most Popular', popularBooks, latestBooks,
        });
    } catch (err) { // In case there's an error, no books will be displayed
        res.render('most-popular', {
            sectionTitle: 'Most Popular', popularBooks: [], latestBooks: [],
        });
    }
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

const express = require('express');

const router = express.Router();

// Google Books API Helper
const booksApi = require('../helpers/booksApi');

// Routes of the main pages
router.get('/', async (req, res) => {
    const homeBooks = await booksApi.getHomeBooks();
    const latestBooks = await booksApi.getRecommendedBooks();
    res.render('home', {
        sectionTitle: 'Home', homeBooks, latestBooks,
    });
});

router.get('/popular', async (req, res) => {
    const popularBooks = await booksApi.getPopularBooks();
    const latestBooks = await booksApi.getRecommendedBooks();
    res.render('most-popular', {
        sectionTitle: 'Most Popular', popularBooks, latestBooks,
    });
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

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
    const latestBooks = await booksApi.getRecommendedBooks();
    res.render('most-popular', {
        sectionTitle: 'Most Popular', latestBooks,
    });
});

router.get('/recent', async (req, res) => {
    const latestBooks = await booksApi.getRecommendedBooks();
    res.render('most-recent', {
        sectionTitle: 'Most Recent', latestBooks,
    });
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

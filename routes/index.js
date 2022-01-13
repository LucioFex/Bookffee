const express = require('express');

const router = express.Router();

// Google Books API Helper
const booksApi = require('../helpers/booksApi');

// Routes of the main pages
router.get('/', async (req, res) => {
    const homeBooks = await booksApi.getHomeBooks();
    const recommendedBooks = await booksApi.getRecommendedBooks();
    res.render('home', {
        sectionTitle: 'Home', homeBooks, recommendedBooks,
    });
});

router.get('/popular', async (req, res) => {
    const recommendedBooks = await booksApi.getRecommendedBooks();
    res.render('most-popular', {
        sectionTitle: 'Most Popular', recommendedBooks,
    });
});

router.get('/recent', async (req, res) => {
    const recommendedBooks = await booksApi.getRecommendedBooks();
    res.render('most-recent', {
        sectionTitle: 'Most Recent', recommendedBooks,
    });
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

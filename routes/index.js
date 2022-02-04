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
    const page = parseInt(req.query.page) || 1;

    try {
        const popularBooks = await booksApi.getPopularBooks(page);
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('most-popular', {
            sectionTitle: 'Most Popular', popularBooks, latestBooks, page,
        });
    } catch (err) { // In case there's an error, no books will be displayed
        res.render('most-popular', {
            sectionTitle: 'Most Popular',
            popularBooks: [],
            latestBooks: [],
            page: 1,
        });
    }
});

router.get('/categories', async (req, res) => { // Categorized Books route
    const page = parseInt(req.query.page) || 1;
    const { subject } = req.query;
    console.log(subject);

    try {
        const [subjectBooks, subjectName] = await booksApi.getCategorizedBooks(subject, page);
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('categories', {
            sectionTitle: `Category: ${subjectName}`,
            subjectBooks,
            latestBooks,
            subject,
            page,
        });
    } catch (err) { // In case there's an error, no books will be displayed
        res.render('categories', {
            sectionTitle: 'Category',
            subjectBooks: [],
            latestBooks: [],
            subject: null,
            page: 1,
        });
    }
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

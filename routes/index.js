const express = require('express');

const router = express.Router();

// Google Books API Helper
const booksApi = require('../helpers/booksApi');

// Routes of the main pages
router.get('/', async (req, res) => { // Home route
    try {
        const homeBooks = await booksApi.getHomeBooks();
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('books-section', {
            sectionTitle: 'Home',
            navbarHome: ' active',
            navbarPopular: '',
            navbarCategories: '',
            books: homeBooks,
            latestBooks,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.get('/popular', async (req, res) => { // Popular Books route
    const page = parseInt(req.query.page) || 1;

    try {
        const [, popularBooks] = await booksApi.getBooks(page);
        const latestBooks = await booksApi.getRecommendedBooks();

        res.render('books-section', {
            sectionTitle: 'Most Popular',
            route: 'popular',
            navbarHome: '',
            navbarPopular: ' active',
            navbarCategories: '',
            query: '',
            books: popularBooks,
            latestBooks,
            page,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.get('/categories', async (req, res) => { // Categorized Books route
    const page = parseInt(req.query.page) || 1;
    const { subject } = req.query;

    try {
        const [subjectName, subjectBooks] = await booksApi.getBooks(page, subject);
        const latestBooks = await booksApi.getRecommendedBooks();

        res.render('books-section', {
            sectionTitle: `Category: ${subjectName}`,
            route: 'categories',
            navbarHome: '',
            navbarPopular: '',
            navbarCategories: ' active',
            query: `subject=${subjectName}&`,
            books: subjectBooks,
            latestBooks,
            page,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.get('/search', async (req, res) => { // Searched Books route
    const page = parseInt(req.query.page) || 1;
    const { q: search } = req.query;

    try {
        const [, searchedBooks] = await booksApi.getBooks(page, '', search);
        const latestBooks = await booksApi.getRecommendedBooks();

        res.render('books-section', {
            route: 'search',
            sectionTitle: `Results for: ${search}`,
            navbarHome: '',
            navbarPopular: '',
            navbarCategories: '',
            query: `q=${search}&`,
            books: searchedBooks,
            latestBooks,
            page,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.get('/books', async (req, res) => { // Book details route
    const { id: bookId } = req.query; // Google Books Api (Volume Id)

    try {
        // Get all possible book information
        const bookInfo = await booksApi.getBookInfo(bookId);
        res.render('book-details', { bookInfo, sectionTitle: bookInfo.title });

        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.post('/search', (req, res) => {
    // Action after the user inputs a book name in the page's searcher
    const { q: search } = req.body;
    return res.redirect(`/search?q=${search}&page=1`);
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;

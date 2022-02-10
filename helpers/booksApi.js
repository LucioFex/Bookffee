const fetch = require('node-fetch');
const {
    getJsonData, orderTopics, manageData, booksFilter,
} = require('./commonFunctions');

const getHomeBooks = async () => {
    /* Function to get 12 books data from the Google Books API.
    Every book comes from a different Api Call, and it's from a
    default list of topics (E.G: Harry+Potter, The+Fourth+Monkey, Joe+Hill) */
    let booksData = [];
    const books = [];
    const topics = await orderTopics();
    const apiUrl = { // Google Books Api URL
        api: 'https://www.googleapis.com/books/v1/volumes?q=',
        config: '&maxResults=5&orderBy=relevance&startIndex=',
        apiKey: `&keyes&key=${process.env.apiKey}`,
    };

    // Get the book URLs Fetch (promises) and Fetch of the books data
    let url; let startIndex; let topic;
    for (let index = 0; index < topics.length; index += 1) {
        topic = topics[index];
        startIndex = Math.floor(Math.random() * 5); // Index from 0 to 5
        url = apiUrl.api + topic + apiUrl.config + startIndex + apiUrl.apiKey;

        booksData.push(fetch(url));
    }

    // Books data conversion to Promise
    booksData = await Promise.all(booksData);

    // Data conversion to JSON
    for (let index = 0; index < booksData.length; index += 1) {
        booksData[index] = booksData[index].json();
    }
    booksData = await Promise.all(booksData);

    // Books filter (by photo, name and description), getting only one per topic
    let data;
    for (let index = 0; index < topics.length - 1; index += 1) {
        data = manageData(booksData[index]);
        if (data === null) continue;
        books.push(data[0]);
    }

    return books;
};

const getBooks = async (page = 1, subject = '', search = '*') => {
    /* Function to return 40 books aprox. Depending on the page's index.
    It works to return 'general popular books', 'newest categorized books',
    or to return the user's search.
    The kind of call will depend in the 'subject' parameter. */

    // Checks if the page's number is bigger than 1
    let pageNum = page;
    if (pageNum < 1 || typeof (pageNum) !== 'number') pageNum = 1;
    const startIndex = (pageNum - 1) * 12;

    // Base of the url for the Google Books Api to call
    const apiUrl = {
        api: 'https://www.googleapis.com/books/v1/volumes?q=',
        config: `&maxResults=40&startIndex=${startIndex}&orderBy=`,
        apiKey: `&keyes&key=${process.env.apiKey}`,
    };

    // Replace the subject if the category is not recognized
    let categories;
    let parameter;

    if (subject !== '') {
        // The condition means this is a 'categories' route call
        categories = await getJsonData('./json/bookLabels.json');
        categories = categories.categories;
        parameter = subject;

        // If the category is not recognized, a random one will be added
        if (!categories.includes(parameter)) {
            const randomIndex = Math.floor(Math.random() * categories.length);
            parameter = categories[randomIndex];
        }

        apiUrl.api += `subject:${parameter}`;
        apiUrl.config += 'newest';
    } else if (subject === '') {
        // The condition means this can be a 'popular' or 'search' route call
        apiUrl.api += search;
        apiUrl.config += 'relevance';
        parameter = search;
    }

    const url = apiUrl.api + apiUrl.config + apiUrl.apiKey;
    const books = await booksFilter(url);

    return [parameter, books];
};

const getRecommendedBooks = async () => {
    /* Function to get 6 recent books divided by 3 sections */
    /* Every section will be focused on one genre */
    let booksData = [];
    const usedGenres = [];
    const books = [[], [], []];
    const apiUrl = { // Google Books Api URL for searches by genre
        api: 'https://www.googleapis.com/books/v1/volumes?q=subject:',
        config: `&maxResults=5&orderBy=newest&keyes&key=${process.env.apiKey}`,
    };
    const { genres } = await getJsonData('./json/bookLabels.json');

    // Books data collection (with three different genres)
    let genre; let url;
    while (booksData.length < 3) { // Fetch of three book genres
        genre = genres[Math.floor(Math.random() * genres.length)];
        if (usedGenres.includes(genre)) continue; // Not repeat a used genre
        usedGenres.push(genre);

        genre = genre.replace(' ', '+').toLowerCase();
        url = apiUrl.api + genre + apiUrl.config;
        booksData.push(fetch(url)); // Add of books from one genre
    }

    // Books data conversion to Promise
    booksData = await Promise.all(booksData);

    // Books data conversion to JSON
    for (let index = 0; index < booksData.length; index += 1) {
        booksData[index] = booksData[index].json();
    }
    booksData = await Promise.all(booksData);

    // Books filter (by photo, name and description), saving only two per genre
    let firstBook; let bookIndex; let data;
    for (let index = 0; index < books.length; index += 1) {
        data = manageData(booksData[index], 0);
        if (data === null) continue;

        books[index].push(usedGenres[index]);
        [firstBook, bookIndex] = data; // Last index
        books[index].push(firstBook);

        data = manageData(booksData[index], bookIndex + 1);
        if (data === null) continue;

        books[index].push(data[0]);
    }

    return books;
};

const getBookInfo = (bookId) => {
    console.log(bookId);
    return bookId;
};

module.exports = {
    getHomeBooks, getBooks, getBookInfo, getRecommendedBooks,
};

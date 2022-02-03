const fetch = require('node-fetch');
const { getJsonData: getBookLabels } = require('./commonFunctions');

const orderTopics = async () => {
    /* Function to select and order 12 default books for the 'Home' route */
    let randomTopic;
    const ordenedTopics = [];
    const { topics } = await getBookLabels('./json/bookLabels.json');

    // If the topic is not used already, it's going to be used
    for (let index = 0; ordenedTopics.length <= 12; index += 1) {
        randomTopic = topics[Math.floor(Math.random() * topics.length)];
        if (!ordenedTopics.includes(randomTopic)) {
            ordenedTopics.push(randomTopic);
        }
    }

    return ordenedTopics;
};

const manageData = (json, startIndex = 0) => {
    /* Function to manage the data from the Google Books API call */
    /* You can select from which index to search first (startIndex) */
    let correctBook;
    let index = 0;

    // Check for the "Too Many Requests" error status
    try {
        if (json.error.code === 429) return null;
    } catch (err) { /* The app continues running */ }

    for (index; index < json.items.length; index += 1) {
        const book = json.items[index + startIndex];
        if ( // Checks for book (with photo and description)
            book !== undefined
            && book.volumeInfo !== undefined
            && book.volumeInfo.description !== undefined
            && book.volumeInfo.imageLinks !== undefined) {
            correctBook = book.volumeInfo;
            break;
        }
    }
    return [correctBook, index];
};

const getHomeBooks = async () => {
    /* Function to get 12 books data from the Google Books API */
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

const getPopularBooks = async (page = 0) => {
    /* Function to return 36 books from the Google Books API.
    The order of the books is by 'relevance'.
    It returns 36 because 12 * 3 = 36, and the pagination can approve that
    there are still 1 or 2 pages more to check from the current one. */
    let booksData = [];
    const books = [];
    const apiUrl = { // Google Books Api URL
        api: 'https://www.googleapis.com/books/v1/volumes?q=*',
        config: '&maxResults=40&orderBy=relevance&startIndex=',
        apiKey: `&keyes&key=${process.env.apiKey}`,
    };

    // Fetch to get 12 popular books
    const startIndex = (page - 1) * 12;
    const url = apiUrl.api + apiUrl.config + startIndex + apiUrl.apiKey;

    // Data fetch, Data conversion to JSON and get of 17 raw books
    booksData = await fetch(url);
    booksData = await booksData.json();

    // Books filter (by photo, name and description), getting only one per topic
    let data; let index = 0;
    while (books.length < 40) {
        index += 1;
        if (index > booksData.items.length) break;

        // Avoid repeated books
        data = manageData(booksData, index);
        if (data === null || books.includes(data[0])) continue;

        books.push(data[0]);
    }
    return books;
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
    const { genres } = await getBookLabels('./json/bookLabels.json');

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

module.exports = { getHomeBooks, getRecommendedBooks, getPopularBooks };

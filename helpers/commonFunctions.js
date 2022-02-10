const fs = require('fs/promises');
const fetch = require('node-fetch');

const getJsonData = async (path) => {
    /* Get the local 'bookLabels' JSON file data/Object */
    try {
        const jsonPath = require.resolve(path);
        const jsonFile = await fs.readFile(jsonPath, 'utf8');
        return JSON.parse(jsonFile);
    } catch (err) { // Add an error handler later...
        console.error('Error occured while reading the JSON file:');
        throw err;
    }
};

const orderTopics = async () => {
    /* Function to select and order 12 default books for the 'Home' route */
    const { topics } = await getJsonData('./json/bookLabels.json');
    const ordenedTopics = [];
    let randomTopic;

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

    try { // Check for the "Too Many Requests" error status
        if (json.error.code === 429) return null;
    } catch (err) { /* The app continues running */ }

    for (index; index < json.items.length; index += 1) {
        const book = json.items[index + startIndex];
        if ( // Checks for book (with photo and description)
            book !== undefined
            && book.volumeInfo !== undefined
            && book.volumeInfo.description !== undefined
            && book.volumeInfo.imageLinks !== undefined) {
            correctBook = book;
            break;
        }
    }
    return [correctBook, index];
};

const booksFilter = async (url) => {
    /* Filter of the returned books that doesn't have neither a:
    Thumbnail, Description or Title. */
    let booksData = [];
    const books = [];

    // Data fetch, Data conversion from JSON to JS and get 40 raw books data
    booksData = await fetch(url);
    booksData = await booksData.json();

    // Books filter process
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

module.exports = {
    getJsonData, orderTopics, manageData, booksFilter,
};

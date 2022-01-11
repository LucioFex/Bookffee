const fetch = require('node-fetch');

const orderTopics = () => {
    /* Function to select and order 12 default books for the 'Home' route */

    let randomTopic;
    const ordenedTopics = [];
    const topics = [
        'fifty+shades+of+grey', 'clean+code', 'jd+barker', 'the+bronzed+beasts',
        'stephen+king+pet+cementary', 'joe+hill+fire', 'hugh+howey', 'werewolf',
        'the+lord+of+The+Rings', 'the+black+Cat', 'the+mistery+of+salem\'s+lot',
        'the+idiot+fyodor', 'the+little+prince', 'frankestein', 'van+hellsing',
        'sherlock+holmes', 'lovecraft', 'think+of+a+number', 'harry+potter',
        'pretty+girls+karin+slaughter', 'joe+hill+strange+water', 'cosmos',
        'rosemary\'s+baby', 'let+the+right+one+in', 'asylum', 'robin+cook',
        'ana+frank', 'rich+dad+poor+dad', 'cracking+the+coding+interview',
        'metamorphosis+kafka', 'the+hell+house', 'dracula+bram+stoker',
        'Metro+2033', 'the+haunting+of+hill+house', 'the+diviners',
        'shadow+of+the+fox', 'words+of+radiance', 'the+poppy+war',
    ];

    // If the topic is not used already, it's going to be used
    for (let index = 0; ordenedTopics.length <= 12; index += 1) {
        randomTopic = topics[Math.floor(Math.random() * topics.length)];
        if (!ordenedTopics.includes(randomTopic)) {
            ordenedTopics.push(randomTopic);
        }
    }
    return ordenedTopics;
};

const manageData = (json) => {
    /* Function to manage the data from the Google Books API call */
    let correctBook;

    for (let index = 0; index < json.items.length; index += 1) {
        const book = json.items[index];
        if ( // Checks for book (with photo and description)
            book.volumeInfo !== undefined
            && book.volumeInfo.description !== undefined
            && book.volumeInfo.imageLinks !== undefined) {
            correctBook = book.volumeInfo;
            break;
        }
    }
    return correctBook;
};

const getHomeBooks = async () => {
    /* Function to get 12 books data from the Google Books API */
    let booksData = [];
    const books = [];
    const topics = orderTopics();
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
    for (let index = 0; index < topics.length - 1; index += 1) {
        books.push(manageData(booksData[index]));
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
    const genres = [ // Book genres
        'action', 'adventure', 'thriller', 'horror', 'terror', 'fantasy',
        'romance', 'drama', 'crime', 'science+fiction', 'programming',
        'fitness', 'history', 'business',
    ];

    // Recollection of books data (with three different genres)
    let genre; let url;
    while (booksData.length < 3) { // Fetch of three book genres
        genre = genres[Math.floor(Math.random() * genres.length)];
        if (usedGenres.includes(genre)) continue; // Not repeat a used genre

        usedGenres.push(genre);
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

    // Books filter (by photo, name and description), getting only one per genre
    for (let col = 0; col < books.length; col += 1) {
        for (let row = 0; row < 2; row += 1) {
            books[col].push(manageData(booksData[row]));
        }
    }

    return books;
};

module.exports = { getHomeBooks, getRecommendedBooks };

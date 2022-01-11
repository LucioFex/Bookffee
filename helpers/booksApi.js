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

const getBooksData = async () => {
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

    // Books data conversion to JSON
    booksData = await Promise.all(booksData);
    for (let index = 0; index < booksData.length; index += 1) {
        booksData[index] = booksData[index].json();
    }

    // Data conversion to JSON
    booksData = await Promise.all(booksData);

    // Books filter (by photo, name and description), getting only one per topic
    for (let index = 0; index < topics.length - 1; index += 1) {
        books.push(manageData(booksData[index]));
    }

    return books;
};

module.exports = { getBooksData };

"use strict";
const fetch = require("node-fetch");


const getBooksData = async () => {  // Requires of a performance improvement later...
    /* Function to get 12 books data from the Google Books API */
    let books = []
    const topics = orderTopics()
    const booksApi = {
        "api": "https://www.googleapis.com/books/v1/volumes?q=",
        "config": "&maxResults=5&orderBy=relevance&:keyes&key="
    }

    var url, response, json
    for (let topic of topics) {
        url = booksApi.api + topic + booksApi.config + process.env.apiKey;
        response = await fetch(url);
        json = await response.json();

        if (response.status !== 200) {
            throw Error("There was a problem getting the books");
        }

        books.push(manageData(json))
    }

    return books;
}

const orderTopics = () => {
    /* Function to select and order 12 defult books for the "Home" route */
    let ordenedTopics = [];
    let randomTopic;
    let topics = [
        "the+idiot+fyodor", "the+little+prince", "frankestein", "van+hellsing",
        "the+lord+of+The+Rings", "the+black+Cat", "the+mistery+of+salem's+lot",
        "sherlock+holmes", "lovecraft", "think+of+a+number", "harry+potter",
        "ana+frank", "rich+dad+poor+dad", "cracking+the+coding+interview",
        "rosemary's+baby", "let+the+right+one+in", "asylum", "robin+cook",
        "metamorphosis+kafka", "the+hell+house", "dracula+bram+stoker",
        "fifty+shades+of+grey", "cosmos", "clean+code", "jd+barker",
        "Metro+2033"
    ];

    for (let index = 0; ordenedTopics.length <= 12; index++) {
        randomTopic = topics[Math.floor(Math.random() * topics.length)];
        if (!ordenedTopics.includes(randomTopic)) {
            ordenedTopics.push(randomTopic);
        }
    }

    console.log(ordenedTopics)
    return ordenedTopics;
}

const manageData = (json) => {
    /* Function to manage the data from the Google Books API call */
    for (let book of json.items) {
        if (  // Checks for book (with photo and description)
            book.volumeInfo !== undefined &&
            book.volumeInfo.description !== undefined &&
            book.volumeInfo.imageLinks !== undefined) {
                return book.volumeInfo;
        }
    }
}


module.exports = { getBooksData };

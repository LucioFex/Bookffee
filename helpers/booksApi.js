"use strict";
const fetch = require("node-fetch");


const getBooksData = async () => {  // Requires of a promise performance improvement later...
    /* Function to get 12 books data from the Google Books API */
    let books = []
    const topics = orderTopics()
    const booksApi = {
        "api": "https://www.googleapis.com/books/v1/volumes?q=",
        "config": "&maxResults=5&orderBy=relevance&startIndex=",
        "apiKey": "&keyes&key=" + process.env.apiKey
    }

    var url, response, json, index
    for (let topic of topics) {
        index = Math.floor(Math.random() * 5)  // Index from 0 to 5
        url = booksApi.api + topic + booksApi.config + index + booksApi.apiKey;
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
        "fifty+shades+of+grey", "clean+code", "jd+barker", "the+bronzed+beasts",
        "stephen+king+pet+cementary", "joe+hill+fire", "hugh+howey", "werewolf",
        "the+idiot+fyodor", "the+little+prince", "frankestein", "van+hellsing",
        "the+lord+of+The+Rings", "the+black+Cat", "the+mistery+of+salem's+lot",
        "sherlock+holmes", "lovecraft", "think+of+a+number", "harry+potter",
        "pretty+girls+karin+slaughter", "joe+hill+strange+water", "cosmos",
        "ana+frank", "rich+dad+poor+dad", "cracking+the+coding+interview",
        "rosemary's+baby", "let+the+right+one+in", "asylum", "robin+cook",
        "metamorphosis+kafka", "the+hell+house", "dracula+bram+stoker",
        "Metro+2033", "the+haunting+of+hill+house", "the+diviners",
        "shadow+of+the+fox", "words+of+radiance", "the+poppy+war"
    ];

    // If the topic is not used already, it's going to be used
    for (let index = 0; ordenedTopics.length <= 12; index++) {
        randomTopic = topics[Math.floor(Math.random() * topics.length)];
        if (!ordenedTopics.includes(randomTopic)) {
            ordenedTopics.push(randomTopic);
        }
    }

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

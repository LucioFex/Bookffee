"use strict";
const fetch = require("node-fetch");


const getBooksData = async () => {
    /* Function to get 12 books data from the Google Books API. */
    let topics = orderTopics()

    // for (topic of topics) {
        
    // }

    let topic = topics[Math.floor(Math.random() * topics.length)];
    const booksApi = {
        "api": "https://www.googleapis.com/books/v1/volumes?q=",
        "config": "&maxResults=20&orderBy=relevance&:keyes&key="
    }
    const url = booksApi.api + topic + booksApi.config + process.env.apiKey;
    const response = await fetch(url);
    const json = await response.json();

    if (response.status !== 200) {
        throw Error("There was a problem getting the books");
    }

    return manageData(json);
}

const orderTopics = () => {
    let ordenedTopics = [];
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

    for (let index = 0; index < 12; index++) {
        ordenedTopics.push(topics[Math.floor(Math.random() * topics.length)]);
    }

    console.log(ordenedTopics)
    return ordenedTopics;
}

const manageData = (json) => {
    /* Function to manage the data from the Google Books API call */
    let books = [];

    for (let book of json.items) {
        if (books.length == 13) break;  // 13 index == 12 books

        else if (  // Checks for book (with photo and description)
            book.volumeInfo !== undefined &&
            book.volumeInfo.description !== undefined &&
            book.volumeInfo.imageLinks !== undefined) {
            books.push(book.volumeInfo);
        }
    }
    return books
}


module.exports = { getBooksData };

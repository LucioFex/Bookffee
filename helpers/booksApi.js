"use strict";
const fetch = require("node-fetch");


const getBooksData = async (topic) => {
    /* Function to get 12 books data from the Google Books API. */
    const booksApi = {
        "api": "https://www.googleapis.com/books/v1/volumes?q=",
        "config": "&maxResults=20&orderBy=relevance&:keyes&key="
    }
    const url = booksApi.api + topic + booksApi.config + process.env.apiKey;
    const response = await fetch(url);
    const json = await response.json();

    if (response.status === 200) {
        return manageData(json);
    }
    throw Error("There was a problem getting the books");
    

    return books;
    // return json.items.slice(0, 12);
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


module.exports = {getBooksData};

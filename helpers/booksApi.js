"use strict";
const fetch = require("node-fetch");


const getBooksData = async (topic) => {
    /* Function to get 12 books data from the Google Books API. */
    const url = `https://www.googleapis.com/books/v1/volumes?q=${topic}:keyes&key=${process.env.apiKey}`;
    const response = await fetch(url);
    const json = await response.json();

    if (response.status !== 200) {
        throw Error("There was a problem getting the books");
    }

    return json.items.slice(0, 12);
}

// getBooksData("harry+potter").then(json => console.log(json[8].volumeInfo.imageLinks.thumbnail)).catch(err => console.log(err));


module.exports = {getBooksData};

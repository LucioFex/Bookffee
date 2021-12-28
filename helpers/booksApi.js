"use strict";

const fetch = require("node-fetch");


const getBooksData = async () => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=harry+potter:keyes&key=${process.env.apiKey}`;
    const response = await fetch(url);
    const json = await response.json();

    if (response.status !== 200) {
        throw Error("Usuario no encontrado");
    }

    return json;
}


module.exports = {getBooksData};

"use strict"
const https = require("https");

let options = {
    host: 'www.googleapis.com',
    path: `www.googleapis.com/books/v1/volumes?q=harry+potter:keyes&key=${process.env.apiKey}`,
    headers: {'User-Agent': 'request'}
}

const getBooksData = () => {
    https.get(options, (res) => {
        let json = "";

        // Received chunk of data
        res.on('data', (chunk) => {json += chunk});

        // The whole response has been received
        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    let data = JSON.parse(json);
                    // Is data available here?:
                    console.log(data.html_url);
                }
                catch (err) {
                    console.log("There was an error parsing the JSON!");
                }
            }

            else if (res.statusCode !== 200) {
                console.log('Current statusCode is:', res.statusCode);
            }
        });
    }).on("error", (err) => {
        console.log("There's an Error:", err);
    });
}


module.exports = {getBooksData};

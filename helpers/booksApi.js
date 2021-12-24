const getBooksData = async () => {
    /* Is a request-function to get the json data from the Google Books API.
    It brings a limit of 12 books, meant to be used in the HTML files.*/
    let request = "https://www.googleapis.com/books/v1/volumes?q=the+lord+of+the+rings";
    let response = await fetch(request);
    let json = await response.json();
    return json
};

const dummyFunct = () => {  // Delete later...
    return "237 Chars Description";
}


module.exports = {getBooksData, dummyFunct};

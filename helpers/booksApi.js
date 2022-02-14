const fetch = require('node-fetch');
const {
    getJsonData, orderTopics, manageData, booksFilter,
} = require('./commonFunctions');

const getHomeBooks = async () => {
    /* Function to get 12 books data from the Google Books API.
    Every book comes from a different Api Call, and it's from a
    default list of topics (E.G: Harry+Potter, The+Fourth+Monkey, Joe+Hill) */
    let booksData = [];
    const books = [];
    const topics = await orderTopics();
    const apiUrl = { // Google Books Api URL
        api: 'https://www.googleapis.com/books/v1/volumes?q=',
        config: '&maxResults=5&orderBy=relevance&startIndex=',
        key: `&keyes&key=${process.env.apiKey}`,
    };

    // Get the book URLs Fetch (promises) and Fetch of the books data
    let url; let startIndex; let topic;
    for (let index = 0; index < topics.length; index += 1) {
        topic = topics[index];
        startIndex = Math.floor(Math.random() * 5); // Index from 0 to 5
        url = apiUrl.api + topic + apiUrl.config + startIndex + apiUrl.key;

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
    let data;
    for (let index = 0; index < topics.length - 1; index += 1) {
        data = manageData(booksData[index]);
        if (data === null) continue;
        books.push(data[0]);
    }

    return books;
};

const getBooks = async (page = 1, subject = '', search = '*') => {
    /* Function to return 40 books aprox. Depending on the page's index.
    It works to return 'general popular books', 'newest categorized books',
    or to return the user's search.
    The kind of call will depend in the 'subject' parameter. */

    // Checks if the page's number is bigger than 1
    let pageNum = page;
    if (pageNum < 1 || typeof (pageNum) !== 'number') pageNum = 1;
    const startIndex = (pageNum - 1) * 12;

    // Base of the url for the Google Books Api to call
    const apiUrl = {
        api: 'https://www.googleapis.com/books/v1/volumes?q=',
        config: `&maxResults=40&startIndex=${startIndex}&orderBy=`,
        key: `&keyes&key=${process.env.apiKey}`,
    };

    // Replace the subject if the category is not recognized
    let categories;
    let parameter;

    if (subject !== '') {
        // The condition means this is a 'categories' route call
        categories = await getJsonData('./json/bookLabels.json');
        categories = categories.categories;
        parameter = subject;

        // If the category is not recognized, a random one will be added
        if (!categories.includes(parameter)) {
            const randomIndex = Math.floor(Math.random() * categories.length);
            parameter = categories[randomIndex];
        }

        apiUrl.api += `subject:${parameter}`;
        apiUrl.config += 'newest';
    } else if (subject === '') {
        // The condition means this can be a 'popular' or 'search' route call
        apiUrl.api += search;
        apiUrl.config += 'relevance';
        parameter = search;
    }

    const url = apiUrl.api + apiUrl.config + apiUrl.key;
    const books = await booksFilter(url);

    return [parameter, books];
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
    const { genres } = await getJsonData('./json/bookLabels.json');

    // Books data collection (with three different genres)
    let genre; let url;
    while (booksData.length < 3) { // Fetch of three book genres
        genre = genres[Math.floor(Math.random() * genres.length)];
        if (usedGenres.includes(genre)) continue; // Not repeat a used genre
        usedGenres.push(genre);

        genre = genre.replace(' ', '+').toLowerCase();
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

    // Books filter (by photo, name and description), saving only two per genre
    let firstBook; let bookIndex; let data;
    for (let index = 0; index < books.length; index += 1) {
        data = manageData(booksData[index], 0);
        if (data === null) continue;

        books[index].push(usedGenres[index]);
        [firstBook, bookIndex] = data; // Last index
        books[index].push(firstBook);

        data = manageData(booksData[index], bookIndex + 1);
        if (data === null) continue;

        books[index].push(data[0]);
    }

    return books;
};

const getBookInfo = async (bookId) => {
    /* Returns the selected book's data with detail, making a
    Google Books Api call over the 'volumes' data. */
    // Url generation
    // const apiUrl = {
    //     api: `https://www.googleapis.com/books/v1/volumes/${bookId}`,
    //     key: `?projection=full&keyes&key=${process.env.apiKey}`,
    // };
    // const url = apiUrl.api + apiUrl.key;

    // // Get of the volumeId data
    // const request = await fetch(url);
    // const json = await request.json();

    // return json; // Received data converted
    return {
        "kind": "books#volume",
        "id": "KBctEAAAQBAJ",
        "etag": "bcz9y4cj3jU",
        "selfLink": "https://www.googleapis.com/books/v1/volumes/KBctEAAAQBAJ",
        "volumeInfo": {
          "title": "Gótico",
          "authors": [
            "Silvia Moreno-García"
          ],
          "publisher": "Minotauro",
          "publishedDate": "2021-06-23",
          "description": "\u003cp\u003eTras recibir una extraña carta de su prima recién casada, Noemí Taboada se dirige a High Place, una casa en el campo en México, sin saber qué encontrará allí. Noemí no parece tener dotes de salvadora: es glamurosa, más acostumbrada a asistir a cócteles que a las tareas de detective. Pero también es fuerte, inteligente y no tiene miedo: ni del nuevo marido de su prima, un inglés amenazante y seductor; ni de su padre, el antiguo patriarca que parece fascinado por Noemí; ni de la casa, que empieza a invadir los sueños de Noemí con visiones de sangre y fatalidad.\u003c/p\u003e \u003cp\u003eEl único amigo que Noemí encontrará es el hijo menor de la familia, quien también da la impresión de estar tapando secretos oscuros. Porque hay muchos secretos escondidos en las pareces de High Place, como descubrirá Noemí cuando empiece a desenterrar historias de violencia y locura. Cautivada por este mundo aterrador a la par que seductor, a Noemí le resultará difícil salvar a su prima... O incluso escapar de esa enigmática casa.\u003c/p\u003e \u003cp\u003ePremio Goodreads a Mejor Novela de Terror 2020.\u003c/p\u003e \u003cp\u003ePremio Locus a Mejor Novela de Terror 2021.\u003c/p\u003e",
          "industryIdentifiers": [
            {
              "type": "ISBN_10",
              "identifier": "8445010549"
            },
            {
              "type": "ISBN_13",
              "identifier": "9788445010549"
            }
          ],
          "readingModes": {
            "text": true,
            "image": true
          },
          "pageCount": 352,
          "printedPageCount": 346,
          "printType": "BOOK",
          "categories": [
            "Fiction / Horror"
          ],
          "maturityRating": "NOT_MATURE",
          "allowAnonLogging": true,
          "contentVersion": "1.2.2.0.preview.3",
          "panelizationSummary": {
            "containsEpubBubbles": false,
            "containsImageBubbles": false
          },
          "imageLinks": {
            "smallThumbnail": "http://books.google.com/books/publisher/content?id=KBctEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE70K6_i6KMd9S8BvvBgbE9DsebrDNcQ6JHE-VTgR9dpS8S9yaFe4PwrtUtrbZwF5eKr3QcEbVVESY8pGfc0v7PlGv9EsNo1uaQ4Fe3m3fQOznkPzt6Gs30-xaLKhWjfmV-XWw2Ar&source=gbs_api",
            "thumbnail": "http://books.google.com/books/publisher/content?id=KBctEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE715xpZ1c5lR97jgc3cdzAV_sT8ZvQQfQzaobgYc39nOBbNFiRLocccJFnkpFef3gYsMoa2PHxSkNZi7nu7ff0BaIKLME-uS1GvQZeBfAioVOP9rTCPWu7MT8bsoYLXXrwHG1wuW&source=gbs_api",
            "small": "http://books.google.com/books/publisher/content?id=KBctEAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&imgtk=AFLRE706qJw_biYA7SadYfmypMCViJmKgJBRuGmT3sv42KVjgjAO9UtCZNHMYRMvIuEuuTDhGapV7MrK249n-TOKxyNhY7DkAu3jGgZVsHh0dW0Q6rleAsecS9-mBQGw7Q-iuKlvIwiB&source=gbs_api",
            "medium": "http://books.google.com/books/publisher/content?id=KBctEAAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&imgtk=AFLRE73cszC1fknKREHTwKNAFgy0lTEjN13BAJ3SHs3ANCHf9Bk-NyOCzxctnT2CeD7djKTfdmY9qIGO4GWW_DAjcNZ4w8UwjXSvq3j3K7lVKu_v7lhVIt-L4KPgnCj84vyAI9z6V0SR&source=gbs_api",
            "large": "http://books.google.com/books/publisher/content?id=KBctEAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE70TsvQgAjXa6cRICJZnF4NAQc_FsLH5aJBph-FYmVNMLpdk64O0DyiZ7KGao4gcYHzj9aEN37BQ4WK4odp7d2DhIbYfw32JFERutERJWy-BI_z-G52fi2PaYAr1OBzzvfbzPooC&source=gbs_api",
            "extraLarge": "http://books.google.com/books/publisher/content?id=KBctEAAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE7250Y6fmqlS2DUBNbLVix26S9DvU6twj4_QDquzGYvIVigy49ZQ2uKzDkRKSVUgeczTsMcGg0kCNesUT3InOCx54LmlqLLISiCgG0Cbk6uS1DSedEr5vxT9OUyDSA9CKl5_EPPY&source=gbs_api"
          },
          "language": "es",
          "previewLink": "http://books.google.com.ar/books?id=KBctEAAAQBAJ&hl=&source=gbs_api",
          "infoLink": "https://play.google.com/store/books/details?id=KBctEAAAQBAJ&source=gbs_api",
          "canonicalVolumeLink": "https://play.google.com/store/books/details?id=KBctEAAAQBAJ"
        },
        "layerInfo": {
          "layers": [
            {
              "layerId": "geo",
              "volumeAnnotationsVersion": "2"
            }
          ]
        },
        "saleInfo": {
          "country": "AR",
          "saleability": "FOR_SALE",
          "isEbook": true,
          "listPrice": {
            "amount": 439.99,
            "currencyCode": "ARS"
          },
          "retailPrice": {
            "amount": 439.99,
            "currencyCode": "ARS"
          },
          "buyLink": "https://play.google.com/store/books/details?id=KBctEAAAQBAJ&rdid=book-KBctEAAAQBAJ&rdot=1&source=gbs_api",
          "offers": [
            {
              "finskyOfferType": 1,
              "listPrice": {
                "amountInMicros": 439990000,
                "currencyCode": "ARS"
              },
              "retailPrice": {
                "amountInMicros": 439990000,
                "currencyCode": "ARS"
              }
            }
          ]
        },
        "accessInfo": {
          "country": "AR",
          "viewability": "PARTIAL",
          "embeddable": true,
          "publicDomain": false,
          "textToSpeechPermission": "ALLOWED",
          "epub": {
            "isAvailable": true,
            "acsTokenLink": "http://books.google.com.ar/books/download/G%C3%B3tico-sample-epub.acsm?id=KBctEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
          },
          "pdf": {
            "isAvailable": true,
            "acsTokenLink": "http://books.google.com.ar/books/download/G%C3%B3tico-sample-pdf.acsm?id=KBctEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
          },
          "webReaderLink": "http://play.google.com/books/reader?id=KBctEAAAQBAJ&hl=&printsec=frontcover&source=gbs_api",
          "accessViewStatus": "SAMPLE",
          "quoteSharingAllowed": false
        }
      };
};

module.exports = {
    getHomeBooks, getBooks, getBookInfo, getRecommendedBooks,
};

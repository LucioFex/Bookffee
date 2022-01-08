// Frameworks and Environment Variables Tool
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('port', process.env.PORT || 3000);

// Body-Parser (integrated in Express)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // Templates Engine:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Web routes
app.use('/', require('./routes/index'));
// app.use('/book', require('./router/book'));  Implement later...

app.listen(app.get('port'), () => {
    console.log(`App working on the Port ${app.get('port')}`);
});

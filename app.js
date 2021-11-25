"use strict";

// Frameworks and Environment Variables
const express = require("express");
const app = express();

require("dotenv").config();
app.set("port", process.env.PORT || 3000);

// Body-Parser (integrated in Express)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Templates Engine:
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

// Web routes
app.use("/", require("./routes/index"));
// app.use("/book", require("./router/book"));  Implement later...


app.listen(app.get("port"), () => {
    console.log(`App working on the Port ${app.get("port")}`);
});

"use strict";

require("dotenv").config()
const express = require("express");

const app = express()
app.set("port", process.env.PORT || 3000)

// Templates Engine:
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

// Web routes
// app.use("/", require("./router/webRoutes"));
// app.use("/pets", require("./router/pets"));

app.use((req, res, next) => {
    res.status(404).render("page-not-found.html")  // Ejs
});


app.listen(app.get("port"), () => {
    console.log(`App working on the Port ${app.get("port")}`);
});


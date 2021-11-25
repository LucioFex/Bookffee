const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("home", {sectionTitle: "Home"});
})

router.get("/categories", (req, res) => {
    res.render("categories", {sectionTitle: "Categories"});
})

router.get("/popular", (req, res) => {
    res.render("most-popular", {sectionTitle: "Most Popular"});
})

router.get("/recent", (req, res) => {
    res.render("most-recent", {sectionTitle: "Most Recent"});
})

router.use((req, res, next) => {
    res.status(404).render("page-not-found")
});

module.exports = router;

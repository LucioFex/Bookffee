const express = require("express");
const router = express.Router();


// Rendering of the main pages (home, categories, popular and recent)
const routes = {
    "/": ["home", "Home"],
    "/categories": ["categories", "Categories"],
    "/popular": ["most-popular", "Most Popular"],
    "/recent": ["most-recent", "Most Recent"]
}

for (let route in routes) {
    router.get(route, (req, res) => {
        res.render(routes[route][0], {sectionTitle: routes[route][1]});
    });
};

// 404 http status response
router.use((req, res, next) => {
    res.status(404).render("page-not-found")
});


module.exports = router;

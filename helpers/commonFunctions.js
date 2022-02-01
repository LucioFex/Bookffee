const json = require('./json/bookLabels.json');

const getJsonData = () => { // Refactor later...
    /* Get the local 'bookLabels' JSON file data */
    return json;
};

module.exports = { getJsonData };

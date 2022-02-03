const fs = require('fs/promises');

const getJsonData = async (path) => {
    /* Get the local 'bookLabels' JSON file data */
    try {
        const jsonPath = require.resolve(path);
        const jsonFile = await fs.readFile(jsonPath, 'utf8');
        return JSON.parse(jsonFile);
    } catch (err) { // Add an error handler later...
        console.error('Error occured while reading the JSON file:');
        throw err;
    }
};

module.exports = { getJsonData };

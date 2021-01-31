'use strict'

const fs = require('fs');

fs.readFile('anuncios.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

        // parse JSON string to JSON object
        const databases = JSON.parse(data);
console.log(databases);
        // print all databases
        // databases.forEach(db => {
        //     console.log(`${db.name}: ${db.type}`);
        // });
    }

});
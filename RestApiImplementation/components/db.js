'use strict';

const sqlite = require('sqlite3').verbose();
const path = require('path');
const { TransactionDatabase } = require('sqlite3-transactions');

const DBSOURCE = path.join(__dirname, '../databases/databaseV3_guido.db');
console.log(DBSOURCE);

const db_0 = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }

    db_0.exec('PRAGMA foreign_keys = ON;', function(error)  {
        if (error){
            console.error("Pragma statement didn't work.")
        }
    });
})

const db = new TransactionDatabase( db_0 );

module.exports = db;

'use strict';

const sqlite = require('sqlite3').verbose();
TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
const path = require('path');
const { TransactionDatabase } = require('sqlite3-transactions');

const DBSOURCE = path.join(__dirname, '../databases/databaseV2.db');
console.log(DBSOURCE);

const db = new TransactionDatabase( 
    new sqlite.Database(DBSOURCE, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message);
            throw err;
        }

        db.exec('PRAGMA foreign_keys = ON;', function(error)  {
            if (error){
                console.error("Pragma statement didn't work.")
            }
        });
    })
);

module.exports = db;

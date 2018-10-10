"use strict";

const Promise = require("bluebird");
const sqlite3 = require("sqlite3");
const path = require("path");

module.exports = {
    up: () => {
        return new Promise((res, rej) => {
            let db = new sqlite3.Database('./database/InvoicingApp.db');
            //enable foreign keys
            db.run(`PRAGMA foreign_keys = ON`);
        });
    },
    down: () => {
        
    }
}
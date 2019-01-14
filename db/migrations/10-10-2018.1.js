"use strict";

require('dotenv').config();
const Promise = require("bluebird");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = new sqlite3.Database(process.env.DB_FILE);

module.exports = {
  up: () => {
    return new Promise((res, rej) => {
      //enable foreign keys
      db.run(`PRAGMA foreign_keys = ON`);
      db.serialize(() => {
        db.run(`CREATE TABLE users(
                id INTEGER PRIMARY KEY,
                email TEXT,
                company_name TEXT,
                nip TEXT,
                address TEXT,
                account_number TEXT,
                password TEXT
               )`);

        db.run(`CREATE TABLE clients(
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                company_name TEXT,
                nip TEXT,
                address TEXT,
                account_number TEXT,
                email TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
               )`);

        db.run(`CREATE TABLE invoices(
                id INTEGER PRIMARY KEY,
                name TEXT,
                buyer_id INTEGER,
                seller_id INTEGER,
                type INTEGER,
                sell_date DATE,
                issue_date DATE,
                sum_net INTEGER,
                sum_vat TEXT,
                sum_gross INTEGER,
                paid NUMERIC,
                FOREIGN KEY(buyer_id) REFERENCES clients(id)
                FOREIGN KEY(seller_id) REFERENCES users(id)
               )`);

        db.run(`CREATE TABLE transactions(
                id INTEGER PRIMARY KEY,
                name TEXT,
                price_net INTEGER,
                value_net INTEGER,
                value_gross INTEGER,
                vat TEXT,
                quantity INTEGER,
                invoice_id INTEGER,
                FOREIGN KEY(invoice_id) REFERENCES invoices(id)
               )`);

        db.close();
      });
    });
  },
  down: () => {
    return new Promise((res, rej) => {
      db.serialize(() => {
        db.run(`DROP TABLE transactions`);
        db.run(`DROP TABLE invoices`);
        db.run(`DROP TABLE users`)
      });
      db.close();
    });
  }
};
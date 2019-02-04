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
                uuid TEXT,
                email TEXT,
                company_name TEXT,
                nip TEXT,
                address TEXT,
                account_number TEXT,
                bank_id INTEGER,
                password TEXT
               )`);

        db.run(`CREATE TABLE clients(
                id INTEGER PRIMARY KEY,
                uuid TEXT,
                user_id INTEGER,
                company_name TEXT,
                nip TEXT,
                address TEXT,
                account_number TEXT,
                email TEXT,
                FOREIGN KEY(user_id) REFERENCES users(uuid)
               )`);

        db.run(`CREATE TABLE invoices(
                id INTEGER PRIMARY KEY,
                uuid TEXT,
                name TEXT,
                buyer_id TEXT,
                seller_id TEXT,
                type INTEGER,
                sell_date DATE,
                issue_date DATE,
                sum_net INTEGER,
                sum_vat TEXT,
                sum_gross INTEGER,
                paid NUMERIC,
                FOREIGN KEY(buyer_id) REFERENCES clients(uuid)
                FOREIGN KEY(seller_id) REFERENCES users(uuid)
               )`);

        db.run(`CREATE TABLE transactions(
                id INTEGER PRIMARY KEY,
                name TEXT,
                price_net INTEGER,
                value_net INTEGER,
                value_gross INTEGER,
                vat TEXT,
                quantity INTEGER,
                invoice_uuid TEXT,
                FOREIGN KEY(invoice_uuid) REFERENCES invoices(uuid)
               )`);

        db.run(`CREATE TABLE banks(
                id INTEGER PRIMARY KEY,
                name TEXT,
                number INTEGER
               )`);

        db.run(`INSERT INTO banks(number, name) VALUES
               (1010,	'Narodowy Bank Polski'),
               (1020,	'PKO BP'),
               (1030,	'Bank Handlowy (Citi Handlowy)'),
               (1050, 'ING'),
               (1060, 'BPH'),
               (1090, 'BZ WBK'),
               (1130, 'BGK'),
               (1140, 'mBank, Orange Finanse'),
               (1160, 'Bank Millennium'),
               (1240, 'Pekao'),
               (1280, 'HSBC'),
               (1320, 'Bank Pocztowy'),
               (1470, 'Eurobank'),
               (1540, 'BOŚ'),
               (1580, 'Mercedes-Benz Bank Polska'),
               (1610, 'SGB - Bank'),
               (1670, 'RBS Bank (Polska)'),
               (1680, 'Plus Bank'),
               (1750, 'Raiffeisen Bank'),
               (1840, 'Societe Generale'),
               (1870, 'Nest Bank'),
               (1910, 'Deutsche Bank Polska'),
               (1930, 'Bank Polskiej Spółdzielczości'),
               (1940, 'Credit Agricole Bank Polska'),
               (1950, 'Idea Bank'),
               (2030, 'BGŻ BNP Paribas'),
               (2070, 'FCE Bank Polska'),
               (2120, 'Santander Consumer Bank'),
               (2130, 'Volkswagen Bank'),
               (2140, 'Fiat Bank Polska'),
               (2160, 'Toyota Bank'),
               (2190, 'DnB Nord'),
               (2480, 'Getin Noble Bank'),
               (2490, 'Alior Bank, T-Mobile Usługi Bankowe');
               `);
        db.close();
      });
    });
  },
  down: () => {
    return new Promise((res, rej) => {
      db.serialize(() => {
        db.run(`DROP TABLE transactions`);
        db.run(`DROP TABLE invoices`);
        db.run(`DROP TABLE users`);
        db.run(`DROP TABLE clients`);
        db.run(`DROP TABLE banks`);
      });
      db.close();
    });
  }
};
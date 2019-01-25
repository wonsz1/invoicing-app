"use strict";

require('dotenv').config();
const Promise = require("bluebird");
const sqlite3 = require("sqlite3");
let db = new sqlite3.Database(process.env.DB_FILE);

module.exports = {
  up: () => {
    return new Promise((res, rej) => {
      //enable foreign keys
      db.run(`PRAGMA foreign_keys = ON`);
      db.serialize(() => {
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
        db.run(`TRUNCATE TABLE banks`);
      });
      db.close();
    });
  }
};
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validate = require('express-validation');
let registerValidation = require('./validation/register.js');
let invoiceValidate = require('./validation/invoice.js');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`)
});

app.get('/', (req, res) => {
    res.send('Hello message');
});

app.post('/register', validate(registerValidation), (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        let db = new sqlite3.Database(process.env.DB_FILE);
        let sql = `INSERT INTO users(nip, email, company_name, password) VALUES(?,?,?,?)`;

        db.run(sql, [req.body.nip, req.body.email, req.body.company_name, hash], (err) => {
            if(err) {
                throw err;
            } else {
                return res.json({
                    status: true,
                    message: `User ${req.body.email} created`
                })
            }
        });
        db.close();
    });
});

// error handler, required as of 0.3.0
app.use((err, req, res, next) => {
    return res.status(400).json(err);
});

app.post('/login', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `SELECT * FROM users WHERE email = (?)`;

    db.all(sql, [req.body.email], (err, rows) => {
       if(err) {
           throw err;
       }
       db.close();

       if(rows.length === 0) {
           return res.json({
             status: false,
             message: "Wrong email"
           });
       }

       let user = rows[0];
       let authenticated = bcrypt.compareSync(req.body.password, user.password);
       if(authenticated) {
           delete user.password;
           return res.json({
             status:true,
             user: user
           });
       }

       return res.json({
         status: true,
         message: "Wrong password"
       });
    });
});

app.post('/invoice', validate(invoiceValidate), (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `INSERT INTO invoices(name, client_id, type, sell_date, issue_date, sum_net, sum_vat, sum_gross, paid) 
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.serialize( () => {
        db.run(sql, [
          req.body.name,
          req.body.client_id,
          req.body.type,
          req.body.sell_date,
          req.body.issue_date,
          req.body.sum_net,
          req.body.sum_vat,
          req.body.sum_gross,
          0
        ], function (err) { //it need to be function not arrow function, because of the absence of a 'this' in arrow lambdas
            if(err) {
                throw err;
            }

            for(let i = 0; i < req.body.txn_name.length; i++) {
              let query = `INSERT INTO transactions(name, price_net, value_net, vat, value_gross, quantity, invoice_id) 
              VALUES(?, ?, ?, ?, ?, ?, ?)`;

              db.run(query, [
                req.body.txn_name[i],
                req.body.txn_price_net[i],
                req.body.txn_value_net[i],
                req.body.txn_vat[i],
                req.body.txn_value_gross[i],
                req.body.txn_quantity[i],
                this.lastID
              ]);
            }

            return res.json({
              status: true,
              message: "Invoice created"
            });
        });
    })
});
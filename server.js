require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validate = require('express-validation');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

let registerValidation = require('./validation/register.js');
let invoiceValidate = require('./validation/invoice.js');
let clientValidate = require('./validation/client.js');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('appSecret', 'secretforapppp');

app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`)
});

app.get('/', (req, res) => {
    res.send('Hello message');
});

app.post('/register', validate(registerValidation), (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        let db = new sqlite3.Database(process.env.DB_FILE);
        const sql = `INSERT INTO users(uuid, nip, email, company_name, password) VALUES(?,?,?,?,?)`;

        db.run(sql, [uuidv4(), req.body.nip, req.body.email, req.body.company_name, hash], (err) => {
            if(err) {
                throw err;
            } else {
              const payload = {
                user: {
                  nip: req.body.nip,
                  email: req.body.email,
                  company_name: req.body.company_name
                }
              };

              const token = jwt.sign(payload, app.get("appSecret"), {
                expiresInMinutes: "24h"
              });

              return res.json({
                status: true,
                token: token,
                message: `User ${req.body.email} created`
              });
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
    const sql = `SELECT * FROM users WHERE email = (?)`;

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
       if(bcrypt.compareSync(req.body.password, user.password)) {
           delete user.password;

           const token = jwt.sign({ user: user }, app.get('appSecret'), {
             expiresIn: "24h"
           });

           return res.json({
             status:true,
             token: token,
             user: user
           });
       }

       return res.json({
         status: true,
         message: "Wrong password"
       });
    });
});

app.use((req, res, next) => {
    let token = req.body.token || req.body.token || req.headers.authorization;
    
    if(token) {
      jwt.verify(token, app.get("appSecret"), (err, decoded) => {
        if(err) {
          return res.status(401).send({
            success: false,
            message: "Failed to authenticate token"
          });
        }

        req.decoded = decoded;
        next();
      });
    } else {
        return res.status(401).send({
            success: false,
            message: "No token provided"
        });
    }
});

app.get('/user/:user_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = 'select * from users where uuid = (?)';

    db.get(sql, [req.params.user_id], (err, user) => {
        if(err) {
            throw err;
        }

        return res.json({
            status: true,
            user: user
        });
    });
});

app.post('/user', validate(clientValidate), (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = 'select * from banks where number = (?)';
    let bankNumber = req.body.account_number.substring(2, 6);

    db.get(sql, [bankNumber], (err, bank) => {
        if(err) {
            throw err;
        }

        let bankId = null;
        if(typeof bank.number !== 'undefined') {
            bankId = bank.id;
        }
        let db = new sqlite3.Database(process.env.DB_FILE);
        let sql = `UPDATE users SET company_name = ?, email = ?, nip = ?, account_number = ?, bank_id = ?, address = ? WHERE uuid = ?`;

        db.serialize( () => {
            db.run(sql, [
                req.body.company_name,
                req.body.email,
                req.body.nip,
                req.body.account_number.replace(/\s/g, ''),
                bankId,
                req.body.address,
                req.body.user_id
            ], function(err) {
                if(err) {
                    throw err;
                }

                return res.json({
                    status: true,
                    message: 'Updated your account settings'
                })
            })
        });
    });
    
});

app.post('/password', (req, res) => {
    let db = sqlite3.Database(process.env.DB_FILE);
    let sql = `UPDATE users SET password = ? where uuid = ?`;

    db.serialize(() => {
        db.run(sql, [
            req.body.password,
            req.body.user_id
        ], function(err) {
            if(err)  {
                throw err;
            }

            return res.json({
                status: true,
                message: 'Password changed'
            })
        })
    });
});

app.post('/invoice', validate(invoiceValidate), (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `INSERT INTO invoices(uuid, name, buyer_id, seller_id, type, sell_date, issue_date, sum_net, sum_vat, sum_gross, paid) 
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const invUuid = uuidv4();

    db.serialize( () => {
        db.run(sql, [
          invUuid,
          req.body.invoice.name,
          req.body.buyer_id,
          req.body.seller_id,
          req.body.invoice.type,
          req.body.invoice.sell_date,
          req.body.invoice.issue_date,
          req.body.invoice.sum_net,
          req.body.invoice.sum_vat,
          req.body.invoice.sum_gross,
          0
        ], function (err) { //it need to be function not arrow function, because of the absence of a 'this' in arrow lambdas
            if(err) {
                throw err;
            }

            for(let i = 0; i < req.body.transactions.length; i++) {
              let query = `INSERT INTO transactions(name, price_net, value_net, vat, value_gross, quantity, invoice_uuid) 
              VALUES(?, ?, ?, ?, ?, ?, ?)`;

              db.run(query, [
                req.body.transactions[i].name,
                req.body.transactions[i].price_net,
                req.body.transactions[i].value_net,
                req.body.transactions[i].vat,
                req.body.transactions[i].value_gross,
                req.body.transactions[i].quantity,
                invUuid
              ]);
            }

            return res.json({
              status: true,
              message: "Invoice created"
            });
        });
    })
});

app.get('/invoice/user/:user_id/:invoice_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let invSql = `SELECT * FROM invoices where seller_id= (?) and invoices.uuid = (?)`;
    let clientSql = `SELECT * FROM clients where id = (?)`;

    db.get(invSql, [req.params.user_id, req.params.invoice_id], (err, invoice) => {
        if(err) {
            throw err;
        }

        db.get(clientSql, [invoice.buyer_id], (err, buyer) => {
            if(err) {
                throw err;
            }

            return res.json({
                status: true,
                invoice: invoice,
                buyer: buyer,
            });
        });
    });
});

app.get('/invoice/user/:user_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `SELECT invoices.*, clients.company_name as client FROM invoices join clients on invoices.buyer_id = clients.id where seller_id= (?)`;

    db.all(sql, [req.params.user_id], (err, rows) => {
        if(err) {
            throw err;
        }

        return res.json({
            status: true,
            invoices: rows
        });
    });
});


app.delete('/invoice/user/:seller_id/:invoice_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `DELETE FROM invoices WHERE seller_id = (?) and uuid = (?)`;

    db.run(sql, [req.params.seller_id, req.params.invoice_id], function(err) {
        if (err) {
            throw err;
        }
        
        return res.json({
            status: true,
            message: "Invoice deleted"
        });
    });
});

app.get('/invoice/transactions/:invoice_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `SELECT * FROM transactions where transactions.invoice_uuid = (?)`;

    db.all(sql, [req.params.invoice_id], (err, rows) => {
        if(err) {
            throw err;
        }

        return res.json({
            status: true,
            transactions: rows
        });
    });
});

app.get('/client/user/:user_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `SELECT * FROM clients where user_id = (?)`;

    db.all(sql, [req.params.user_id], (err, rows) => {
        if(err) {
            throw err;
        }

        return res.json({
            status: true,
            clients: rows
        });
    });
});


app.post('/client', validate(clientValidate), (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `INSERT INTO clients(company_name, address, nip, email, account_number, user_id, uuid) 
    VALUES(?, ?, ?, ?, ?, ?)`;

    db.serialize( () => {
        db.run(sql, [
          req.body.company_name,
          req.body.address,
          req.body.nip,
          req.body.email,
          req.body.account_number,
          req.body.user_id,
          uuidv4()
        ], function (err) {
            if(err) {
                throw err;
            }

            return res.json({
              status: true,
              message: "Client created",
              client_id: this.lastID
            });
        });
    })
});

app.delete('/client/:client_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `DELETE FROM clients WHERE uuid = (?)`;

    db.run(sql, [req.params.client_id], function(err) {
        if (err) {
            throw err;
        }
        
        return res.json({
            status: true,
            message: "Client deleted" + req.params.client_id
        });
    });
});

app.get('/bank/:bank_id', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = 'select * from banks where id = (?)';

    db.get(sql, [req.params.bank_id], (err, bank) => {
        if(err) {
            throw err;
        }

        return res.json({
            status: true,
            bank: bank
        });
    });
});
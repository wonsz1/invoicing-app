require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validate = require('express-validation');
let validation = require('./validation/register.js');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`)
});

app.get('/', (req, res) => {
    res.send('Hello message');
});

app.post('/register', validate(validation), (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        let db = new sqlite3.Database(process.env.DB_FILE);
        let sql = `INSERT INTO users(nip, email, company_name, password) VALUES(
            '${req.body.nip}','${req.body.email}', '${req.body.company_name}', '${hash}'
        )`;

        db.run(sql, (err) => {
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
app.use(function(err, req, res, next){
    return res.status(400).json(err);
});

app.post('/login', (req, res) => {
    let db = new sqlite3.Database(process.env.DB_FILE);
    let sql = `SELECT * FROM users WHERE email='${req.body.email}'`;

    db.all(sql, [], (err, rows) => {
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
             user: user,
           });
       }

       return res.json({
         status: true,
         message: "Wrong password"
       })
    });
});
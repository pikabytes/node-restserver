const expres = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = expres();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDb) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or Password incorrect.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or Password incorrect.'
                }
            });
        }

        let token = jwt.sign({
            user: userDb
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(200).json({
            ok: true,
            user: userDb,
            token: token
        });


    });
})



module.exports = app;
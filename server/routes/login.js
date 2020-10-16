const expres = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const User = require('../models/user');
const user = require('../models/user');
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


// Google configurations

async function verify(token) {
    const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let gtoken = req.body.idtoken;
    let googleUser = await verify(gtoken)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });
    
    User.findOne({email: googleUser.email}, (err, userdb)=> {
        if (err) return res.status(500).json({
            ok: false,
            err
        });

        if(userdb){
            if(userdb.google === false){
                if (err) return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You must use your default autenthication.'
                    }
                });
            }else{
                let token = jwt.sign({
                    user: userdb
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    user: userdb,
                    token
                });
            }
         } 
         else { // user does not exist in database
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.password = 'x_x';

            console.log(user);
            user.save((err, userdb) => {
                if (err) return res.status(500).json({
                    ok: false,
                    err
                });

                let token = jwt.sign({
                    user: userdb
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    user: userdb,
                    token
                });
            });
        }
    });


    res.json({
        user: googleUser
    })
});



module.exports = app;
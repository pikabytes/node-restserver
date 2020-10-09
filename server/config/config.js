//=========================
// PORT
//=========================
process.env.PORT = process.env.PORT || 3000;

//=========================
// ENVIROMENT
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
// DATA BASE
//=========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=========================
// EXPIRE TOKEN
//=========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=========================
// SEED AUTHENTICATION
//=========================

process.env.SEED = process.env.SEED || 'seed-secreto';





// see env vars heroku
// heroku config
// to create var env in heroku
// heroku config:set SEED="value"
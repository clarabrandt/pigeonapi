const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const firebaseHelper = require('firebase-functions-helper');
const express = require('express');
const bodyParser = require("body-parser");

firebase.initializeApp(functions.config().firebase);

const db = firebase.firestore();

const app = express();
const main = express();

const resultadosCollection = 'resultados';

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// webApi is your functions name, and you will pass main as 
// a parameter

// View a resultado
app.get('/resultados/:id', (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, resultadosCollection, req.params.id)
    .then(doc => res.status(200).send(doc))
    .catch(err => console.error(err));
})
// View all resultados
app.get('/resultados', (req, res) => {
  firebaseHelper.firestore
    .backup(db, resultadosCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
})

exports.api = functions.https.onRequest(app);

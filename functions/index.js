const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const firebaseHelper = require('firebase-functions-helper');
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origins: true});

firebase.initializeApp(functions.config().firebase);

// export const auth = firebase.auth();
// auth.signInWithEmailAndPassword(email, pass);
// auth.onAuthStateChanged(firebaseUser => {})

const db = firebase.firestore();
const app = express();
const main = express();
// const auth = firebase.auth();
// const storage = firebase.storage();

const resultadosCollection = 'resultados';
const blogCollection = 'blog';
const sobreCollection = 'sobre'

main.use('/api/v1', app);
// main.use(bodyParser.json());
main.use(express.json());
main.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors);
app.use(cookieParser);
// webApi is your functions name, and you will pass main as 
// a parameter

// Sign in credentials
// firebase.auth().signInWithEmailAndPassword(email, password)
//   .catch(error => console.error(error));

// Sign out credentials
// firebase.auth().signOut()
//     .then()
//     .catch(err => console.error(err));

    
/**
 * AUTHENTICATION
 */

// app.post('/login', (req, res) => {
//   const email = req.body.username;
//   const password = req.body.password;

//   auth.signInWithEmailAndPassword(email, password)
//     .then(data => res.status(200).send(data))
//     .catch(error => console.error(error));
// })


/**
 * About
 */

// View info about
app.get('/sobre', (req, res) => {
  firebaseHelper.firestore
    .backup(db, sobreCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
})
// Update info about
/**
 * RESULTS
 */

// View all resultados
app.get('/resultados', (req, res) => {
  firebaseHelper.firestore
    .backup(db, resultadosCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
})

// View a resultado
app.get('/resultados/:id', (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, resultadosCollection, req.params.id)
    .then(doc => res.status(200).send(doc))
    .catch(err => console.error(err));
})

// Post resultado

/**
 * BLOG
 */

// View all blog posts
app.get('/blog', (req, res) => {
  firebaseHelper.firestore
    .backup(db, blogCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
})

// post on blog
// app.post('/blog',
// {
//     method: "POST",
//     body: JSON.stringify({titulo: titulo, conteudo: conteudo})
// })
//   .then(data => res.status(200).send(data))
//   .catch(err => console.error(err));
// app.post('/blog', (req, res) => {
//   firebaseHelper.firestore
//     .backup(db, blogCollection)
//     .then(data => res.status(200).send(data))
//     .catch(err => console.error(err));
// })
// db.collection('blog').doc().set({
//   titulo: inputTitle,
//   conteudo: inputContent 
// })
//   .then(data => res.status(200).send(data))
//   .catch(error => console.error(error))

app.post('/blog', (req, res) => {
  const blog = new Object();
  blog.titulo= req.body.titulo;
  blog.conteudo= req.body.conteudo;
  firebaseHelper.firestore
    .createNewDocument(db, 'blog', blog)
      .then(data => res.status(200).send(JSON.stringify(data)))
      .catch(error => res.status(500).send(JSON.stringify(error)));
})


exports.api = functions.https.onRequest(app);

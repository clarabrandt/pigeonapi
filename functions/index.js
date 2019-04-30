/* eslint-disable promise/no-nesting */
const functions = require("firebase-functions");
// const firebase = require("firebase/app");
// require("firebase/auth");
const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origins: true });

// firebase.initializeApp();
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://pigeon-90548.firebaseio.com"
});

// admin.initializeApp(functions.config().firebase);

// auth.signInWithEmailAndPassword(email, pass);
// auth.onAuthStateChanged(firebaseUser => {})

const db = admin.firestore();
const app = express();
const main = express();
// const auth = admin.auth();
// const storage = admin.storage();

const resultadosCollection = "resultados";
const blogCollection = "blog";
const sobreCollection = "sobre";
const midiaCollection = "midia";
const fotosCollection = "fotos";

main.use("/api/v1", app);
// main.use(bodyParser.json());
main.use(express.json());
main.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors);
app.use(cookieParser);
// webApi is your functions name, and you will pass main as
// a parameter

// Sign in credentials
// admin.auth().signInWithEmailAndPassword(email, password)
//   .catch(error => console.error(error));

// Sign out credentials
// admin.auth().signOut()
//     .then()
//     .catch(err => console.error(err));

/**
 * AUTHENTICATION
 */

app.post("/login", (req, res) => {
  const emailQueOUsuarioDigitou = req.body.email;
  const passwordQueOUsuarioDigitou = req.body.password;

  admin
    .auth()
    .getUserByEmail(emailQueOUsuarioDigitou)
    .then(data => console.log("U LE LE", data))
    .catch(err => console.log("U LA LA", err));
});

/**
 * About
 */

// View info about
app.get("/sobre", (req, res) => {
  firebaseHelper.firestore
    .backup(db, sobreCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
});
// Post info about
app.post("/sobre", (req, res) => {
  const sobre = new Object();
  sobre.sobre = req.body.sobre;
  firebaseHelper.firestore
    .createNewDocument(db, "sobre", sobre)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(error => res.status(500).send(JSON.stringify(error)));
});
// Delete sobre
app.delete("/sobre", (req, res) => {
  firebaseHelper.firestore
    .deleteDocument(db, "sobre", req.body.key)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

// Update info about
app.put("/sobre", (req, res) => {
  const sobre = new Object();
  sobre.sobre = req.body.sobre;
  firebaseHelper.firestore
    .updateDocument(db, "sobre", req.body.key, sobre)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

/**
 * RESULTS
 */

// View all resultados
app.get("/resultados", (req, res) => {
  firebaseHelper.firestore
    .backup(db, resultadosCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
});

// Create a resultado file entry
app.post('/resultados/', (req, res) => {
  const resultado = new Object();
  resultado.name = req.body.name;

  const collectionRef = db.collection(resultadosCollection)
    .add(resultado);

  collectionRef.then(response => {
    return res.status(200).send({ success: true, id: response.id })
  })
    .catch(err => console.error(err));
})

app.get('/resultados/:id', (req, res) => {
  const collectionRef = db.collection(resultadosCollection).doc(req.params.id).collection("arquivos").get()
  
  collectionRef.then(snapshot => {
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, data: doc.data() });
// // View a resultado
// app.get("/resultados/:id", (req, res) => {
//   const collectionRef = db
//     .collection(resultadosCollection)
//     .doc(req.params.id)
//     .collection("arquivos")
//     .get();

//   collectionRef
//     .then(snapshot => {
//       const data = [];
//       snapshot.forEach(doc => {
//         data.push(doc.data());
      });
      return res.status(200).send(data);
    })
    .catch(err => console.error(err));
});

// Create a resultado file entry
app.post("/resultados/:id", (req, res) => {
  const resultado = new Object();
        resultado.name = req.body.name;
        resultado.url = req.body.url;

  const collectionRef = db.collection(resultadosCollection)
                          .doc(req.params.id)
                          .collection("arquivos")
                          .add(resultado);

  collectionRef.then(response => {
    return res.status(200).send({ success: true, id: response.id })
  })
  .catch(err => console.error(err));
})
// Delete a resultado file entry
app.delete('/resultados/:id/:file', (req, res) => {
  const resultado = new Object();
        resultado.name = req.body.name;
        resultado.url = req.body.url;

  const collectionRef = db.collection(resultadosCollection)
                          .doc(req.params.id)
                          .collection("arquivos")
                          .doc(req.params.file)
                          .delete();

  collectionRef.then(response => {
    return res.status(200).send({ success: true, id: response.id })
  })
  .catch(err => console.error(err));
})

// Post resultado

/**
 * BLOG
 */

// View all blog posts
app.get("/blog", (req, res) => {
  firebaseHelper.firestore
    .backup(db, blogCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
});

// Add blog post
app.post("/blog", (req, res) => {
  const blog = new Object();
  blog.titulo = req.body.titulo;
  blog.conteudo = req.body.conteudo;
  firebaseHelper.firestore
    .createNewDocument(db, "blog", blog)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

// Delete blog post
app.delete("/blog", (req, res) => {
  firebaseHelper.firestore
    .deleteDocument(db, "blog", req.body.key)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

//Update blog post
app.put("/blog", (req, res) => {
  const blog = new Object();
  blog.titulo = req.body.titulo;
  blog.date = req.body.date;
  blog.conteudo = req.body.conteudo;
  firebaseHelper.firestore
    .updateDocument(db, "blog", req.body.key, blog)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

/**
 * MIDIA
 */

// View all midia posts
app.get("/midia", (req, res) => {
  firebaseHelper.firestore
    .backup(db, midiaCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
});

// Add midia post
app.post("/midia", (req, res) => {
  const midia = new Object();
  midia.titulo = req.body.titulo;
  midia.conteudo = req.body.conteudo;
  firebaseHelper.firestore
    .createNewDocument(db, "midia", midia)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

// Delete midia post
app.delete("/midia", (req, res) => {
  firebaseHelper.firestore
    .deleteDocument(db, "midia", req.body.key)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

//Update midia post
app.put("/midia", (req, res) => {
  const midia = new Object();
  midia.titulo = req.body.titulo;
  midia.conteudo = req.body.conteudo;
  firebaseHelper.firestore
    .updateDocument(db, "midia", req.body.key, midia)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

/**
 * FOTOS
 */

// View all foto posts
app.get("/home", (req, res) => {
  firebaseHelper.firestore
    .backup(db, fotosCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.error(err));
});

// Add foto post
app.post("/home", (req, res) => {
  const foto = new Object();
  fotos.foto = req.body.foto;
  firebaseHelper.firestore
    .createNewDocument(db, "fotos", foto)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

// Delete foto post
app.delete("/home", (req, res) => {
  firebaseHelper.firestore
    .deleteDocument(db, "fotos", req.body.key)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

//Update foto post
app.put("/home", (req, res) => {
  const foto = new Object();
  fotos.foto = req.body.foto;
  firebaseHelper.firestore
    .updateDocument(db, "fotos", req.body.key, foto)
    .then(data =>
      res.status(200).send(JSON.stringify({ key: req.body.key, data }))
    )
    .catch(error => res.status(500).send(JSON.stringify(error)));
});

exports.api = functions.https.onRequest(app);

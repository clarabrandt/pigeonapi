export const auth = firebase.auth();
auth.signInWithEmailAndPassword(email, pass);
auth.onAuthStateChanged(firebaseUser => {})
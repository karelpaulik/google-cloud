// npm install firebase

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from 'firebase/auth';

const firebaseConfig = {
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "firestore-in-fb-pa1");
const auth = getAuth(app);

//Vytvoření uživatele, heslo min. 6 znaků
function createDbUser(user, psw) {
  createUserWithEmailAndPassword(auth, user, psw)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

//Přihlášení uživatele
function login() {
  signInWithEmailAndPassword(auth, "karelpaulik@email.cz", "asdf1234")
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

//Odhlášení uživatele
function logout() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("odhlášen uživatel")
  }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
  });
}

// Nastavení posluchače pro změny stavu autentizace
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Uživatel je přihlášen
    console.log("Uživatel je přihlášen:", user.email);
    console.log("UID uživatele:", user.uid);
    // Zde můžete aktualizovat UI, načíst uživatelská data atd.
  } else {
    // Uživatel není přihlášen
    console.log("Uživatel není přihlášen.");
    // Zde můžete aktualizovat UI tak, aby zobrazovala přihlašovací formulář
  }
});

async function adduser(fName, lName) {
  try {
    const usersCollection = collection(db, "users");
      const docRef = await addDoc(usersCollection, {
        fName: fName,
        lName: lName,
        born: 1815,
      });
      console.log(docRef.id);
      process.exit(0);  //Toto je jen, aby doběhlo: node src/index.js
  } catch (e) {
      console.error("Chyba při přidávání dokumentu:", e);
      process.exit(1); // Ukončí proces s chybovým kódem
  }
}

//čtení dat
async function readDoc(coll, idDocum) {
  const docRef = doc(db, coll, idDocum); // Specifický dokument
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
}

async function searchDocumentsByField(collectionName, fieldName, fieldValue) {
    // Toto je REFERENCE NA KOLEKCI
    const usersCollectionRef = collection(db, collectionName);
    // Toto je QUERY
    const q = query(usersCollectionRef, where(fieldName, '==', fieldValue));
    const querySnapshot = await getDocs(q); // Tady se používá getDocs

    if (querySnapshot.empty) {
        console.log("No documents found by query.");
    } else {
        querySnapshot.forEach(doc => {
            console.log("Found by query:", doc.id, doc.data());
        });
    }
}

//AUTHENTICATION
//login();
//logout();
//createDbUser("petr.stredni@gmail.com", "aaabbbccc");

//OPERATION WITH RECORDS
adduser("Petr", "Malý");
//readDoc("users", "1hv7MLFAgbXxW99z6kLv");
//searchDocumentsByField("users", "fName", "Petr");

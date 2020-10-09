import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAlm49edkveTdPmtegL4Bb6NzDvS2L504Y",
    authDomain: "instagram-clone-ef5cf.firebaseapp.com",
    databaseURL: "https://instagram-clone-ef5cf.firebaseio.com",
    projectId: "instagram-clone-ef5cf",
    storageBucket: "instagram-clone-ef5cf.appspot.com",
    messagingSenderId: "970975870375",
    appId: "1:970975870375:web:f1c86295293e993dc30a82",
    measurementId: "G-LD90GT99DN"
})

export const db = firebaseApp.firestore() // DB
export const auth = firebase.auth() // authentication for login, logout, or signup
export const storage = firebase.storage() // upload bunch of data to firebase

// export default { db, auth, storage }
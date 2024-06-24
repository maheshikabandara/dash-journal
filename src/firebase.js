import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import { getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "dash-journal.firebaseapp.com",
    projectId: "dash-journal",
    storageBucket: "dash-journal.appspot.com",
    messagingSenderId: "184723158492",
    appId: "1:184723158492:web:e076b2044771a441020b19"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  export {db,storage,auth};
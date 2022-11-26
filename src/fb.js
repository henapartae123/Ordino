  // Your web app's Firebase configuration
  import firebase from 'firebase/app';
  import 'firebase/auth'
  import 'firebase/firestore'
 

  const firebaseConfig = {
  apiKey: "AIzaSyD4XW5Lk1yk7RB0QeWPONZpg53n7drpxA8",
  authDomain: "ordino-2e073.firebaseapp.com",
  projectId: "ordino-2e073",
  storageBucket: "ordino-2e073.appspot.com",
  messagingSenderId: "288469367648",
  appId: "1:288469367648:web:f781e33201e93cc6f43c05",
  measurementId: "G-GSJGFVHC2B"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  //MAKING auth and firestore referances

  const auth = firebase.auth();
  const db = firebase.firestore();

  export default { auth, db } ;


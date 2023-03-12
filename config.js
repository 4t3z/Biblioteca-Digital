import firebase from "firebase";
//require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCssPOzdZ78slv8g4rRYwG8U11xWCQHD6M",
  authDomain: "biblioteca-digital-665a7.firebaseapp.com",
  projectId: "biblioteca-digital-665a7",
  storageBucket: "biblioteca-digital-665a7.appspot.com",
  messagingSenderId: "541716721289",
  appId: "1:541716721289:web:8be890a47b071e4236a058"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
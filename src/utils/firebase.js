import * as firebase from "firebase/app";
//import { initializeApp } from "firebase/app";

// firebase configurations

const firebaseConfig = {
    apiKey: "AIzaSyASibIdLr5mPPTv3oINM2J2NzlGVHRiv1Y",
    authDomain: "sgmc-token.firebaseapp.com",
    projectId: "sgmc-token",
    storageBucket: "sgmc-token.appspot.com",
    messagingSenderId: "135245325907",
    appId: "1:135245325907:web:f7a27cec7a25f52274c8a6"
  };
  

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

export default firebase
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD5kxcwLCsSzVWrRwQ4v5DuiemT5_oupf0",
  authDomain: "parcial3-51c37.firebaseapp.com",
  projectId: "parcial3-51c37",
  storageBucket: "parcial3-51c37.appspot.com",
  messagingSenderId: "888228983807",
  appId: "1:888228983807:web:1c5c98f4e1546a7dabadca",
  measurementId: "G-CGQKCSZRHK"
};

const appFirebase = initializeApp(firebaseConfig)
export default appFirebase;
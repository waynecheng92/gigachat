// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyB0J92Z3B3MPDL0sgKpdiett4x7E-uj0Gs",
//     authDomain: "gigachat-ab13c.firebaseapp.com",
//     projectId: "gigachat-ab13c",
//     storageBucket: "gigachat-ab13c.appspot.com",
//     messagingSenderId: "1059544273852",
//     appId: "1:1059544273852:web:5869d79fb568267d9891b9",
//     measurementId: "G-BZ06K6GKXX"
// };

const firebaseConfig = {
    apiKey: "AIzaSyDVwa_HVYlweFpXubrjwslMKcIWz-w9cdw",
    authDomain: "gigachat-51308.firebaseapp.com",
    projectId: "gigachat-51308",
    storageBucket: "gigachat-51308.appspot.com",
    messagingSenderId: "871685632257",
    appId: "1:871685632257:web:71a8f258ef58f4d04d2b00"
  };

let firebaseApp
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

export default firebaseApp;
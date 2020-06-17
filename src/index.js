import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase'

// console.log(process.env.REACT_APP_API_KEY);
var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "payment-tracker-8098d.firebaseapp.com",
  databaseURL: "https://payment-tracker-8098d.firebaseio.com",
  projectId: "payment-tracker-8098d",
  storageBucket: "payment-tracker-8098d.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGE_SEND_ID,
  appId: "1:540515627488:web:60fb67965aada7f874fb85"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

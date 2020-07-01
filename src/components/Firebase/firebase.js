import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "payment-tracker-8098d.firebaseapp.com",
    databaseURL: "https://payment-tracker-8098d.firebaseio.com",
    projectId: "payment-tracker-8098d",
    storageBucket: "payment-tracker-8098d.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGE_SEND_ID,
    appId: "1:540515627488:web:60fb67965aada7f874fb85"
};

export default class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.db = app.database();
    }

    transaction = (projectKey, transactionKey) => this.db.ref(`projects/${projectKey}/transactions/${transactionKey}`);

    project = projectKey => this.db.ref(`projects/${projectKey}`)

    transactions = projectKey => this.db.ref(`projects/${projectKey}/transactions`)
}
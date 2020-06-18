import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase'
import './App.css';
import TransactionDropdown from './components/TransactionDropdown';

const App = () => {
  const [project, setProject] = useState(null);
  const [projectKey, setProjectKey] = useState(null);

  useEffect(() => {
    const projects = firebase.database().ref('projects');
    const project = projects.child('dummy');
    project.on('value', snap => {
      setProject(snap.val());
      console.log(snap.key)
      setProjectKey(snap.key);
    })
    // setProject(child)
  }, [])

  const handleAddTransaction = () => {
    const projects = firebase.database().ref('projects');
    const transactions = projects.child(projectKey + "/transactions");
    const now = (new Date()).toDateString();
    transactions.push({
      amount: 25,
      comment: "comment here lol",
      dateOccurred: now,
      datePaid: "n/a",
      name: "Tutoring Riley",
      paid: false,
      topics: "Distributive Property, Exponents"
    })
  }

  const payTransactions = (transactionKeys) => {
    const projects = firebase.database().ref('projects');
    const transactions = projects.child(projectKey + "/transactions");

    for (let i = 0; i < transactionKeys.length; i++) {
      const transaction = transactions.child(transactionKeys[i]);
      const now = (new Date()).toDateString();
      transaction.update({
        paid: true,
        datePaid: now
      })
    }

  }

  const payAll = () => {
    if (!project)
      return;
    const transactionKeys = Object.keys(project.transactions);
    const transactions = Object.values(project.transactions);

    let payList = [];

    let paidValue = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (!transactions[i].paid) {
        paidValue += transactions[i].amount;
        payList.push(transactionKeys[i])
      }
    }

    const confirmed = window.confirm("Are you sure you want to pay " + payList.length + " transactions for $" + paidValue + "?");

    if (confirmed) {
      payTransactions(payList);
      return paidValue;
    }

    return 0;
  }

  const calculateTotal = () => {
    if (project) {
      const transactions = Object.values(project.transactions);
      let total = 0;

      for (let i = 0; i < transactions.length; i++) {
        if (!transactions[i].paid)
          total += transactions[i].amount
      }
      return total;
    }
    return 0;
  }

  let keyCount = -1;
  const keys = project ? Object.keys(project.transactions) : [];
  return (
    <div className="App">
      <h1>{project ? project.name + " - " : ""} Dashboard</h1>
      <div>
        Total Due: ${calculateTotal()}
      </div>
      <button onClick={payAll}>Pay All</button>
      {project && Object.values(project.transactions).map(transaction => {
        keyCount++;
        return <TransactionDropdown key={transaction}
          transaction={transaction}
          projectKey={projectKey}
          transactionKey={keys[keyCount]} />
      })}
      <button onClick={handleAddTransaction} disabled>Create Session</button>
    </div>
  );
}

export default App;
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

  let keyCount = -1;
  const keys = project ? Object.keys(project.transactions) : [];
  return (
    <div className="App">
      <h1>{project ? project.name + " - " : ""} Dashboard</h1>
      {project && Object.values(project.transactions).map(transaction => {
        keyCount++;
        return <TransactionDropdown key={transaction}
          transaction={transaction}
          projectKey={projectKey}
          transactionKey={keys[keyCount]} />
      })}
    </div>
  );
}

export default App;
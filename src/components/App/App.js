import React from 'react';
import './App.css';
import Dashboard from '../Dashboard/Dashboard.js';
import { withFirebase } from '../Firebase'

const App = () => {

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default withFirebase(App);
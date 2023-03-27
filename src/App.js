import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Reddit from './components/reddit/Reddit';

function App() {
  return (
    <div className="App">
     <Router>
      <Reddit />
      </Router>
     
    </div>
  );
}

export default App;

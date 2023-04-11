import React from 'react';
import './App.css';
import "./styles/styles.css"
import { BrowserRouter as Router } from 'react-router-dom';
import Reddit from './components/reddit/Reddit';
import { useSelector } from 'react-redux';
import { selectTheme } from './app/store';

function App() {

  const theme = useSelector(selectTheme)

  return (
    <div className={theme === "light" ? "bg-light-color app" : "bg-dark-color app"} >
     <Router>
      <Reddit />
      </Router>
     
    </div>
  );
}

export default App;

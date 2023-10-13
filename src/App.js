import React from 'react';
import './App.css';
import "./styles/styles.css"
import { BrowserRouter as Router } from 'react-router-dom';
import Reddit from './components/reddit/Reddit';
import { useSelector } from 'react-redux';
import { selectTheme } from './store/store';
import { useEffect } from 'react';
import { toggleTheme } from './store/store';
import { useDispatch } from 'react-redux';

function App() {

  const dispatch= useDispatch()
  const theme = useSelector(selectTheme)
 
  useEffect(()=>{
    
    if(toggleTheme(localStorage.getItem("theme")))
    {
      dispatch(toggleTheme(localStorage.getItem("theme")))
    }

    }
  
    
  ,[dispatch])

  return (
    <div className={theme === "light" ? "bg-light-color app" : "bg-dark-color app"} >
     <Router>
      <Reddit />
      </Router>
     
    </div>
  );
}

export default App;

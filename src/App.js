import React from 'react';
import './App.css';
import SearchResults from './components/searchResults/SearchResults';
import Reddit from './util/Reddit';

function App() {
  return (
    <div className="App">
      <SearchResults/>
      <Reddit/>
    </div>
  );
}

export default App;

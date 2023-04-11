import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../../app/store";
export default function SearchOptionSelector({ selectedSearchOption, setSelectedSearchOption}) {
  
  // Get option value from URL
  const pathname = window.location.pathname;
  const parts = pathname.split('/');
  const search = parts[3];

  const theme = useSelector(selectTheme)

  // Set option value
  const onClick = (option) => {
    setSelectedSearchOption(option);
   
  };

  return (
    <div className={theme === "dark" ? "options-container flex-row bg3-dark-color"
    : "options-container flex-row bg3-light-color" }>
      
      <Link to={`/searchResults/posts/${search}`}>
      <button className="options-btn"
       onClick={() => onClick("posts")} 
       style={{ backgroundColor: selectedSearchOption === "posts" ? "##cfd1d4" : "##e1e4eb", color: selectedSearchOption === "posts" ? "#7a11fa" : "gray" }}>Posts</button>
      </Link>
      <Link to={`/searchResults/subreddits/${search}`}>
      <button 
      className="options-btn" 
      onClick={() => onClick("subreddits")}
       style={{ backgroundColor: selectedSearchOption === "subreddits" ? "##cfd1d4" : "##e1e4eb", color: selectedSearchOption === "subreddits" ? "#7a11fa" : "gray" }}>Subreddits</button>
      </Link>
    </div>
  );
}
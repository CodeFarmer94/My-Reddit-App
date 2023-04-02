import React from "react";
import { Link } from "react-router-dom";

export default function SearchOptionSelector({ selectedSearchOption, setSelectedSearchOption}) {
  const pathname = window.location.pathname;
  const parts = pathname.split('/');
  const search = parts[3];

  const onClick = (option) => {
    setSelectedSearchOption(option);
    console.log(option);
  };

  return (
    <div style={{ backgroundColor: "white", display: "flex", justifyContent: "left", width: "96%", margin: "1rem auto", padding: "0.5rem 0", border: "1px solid gray", borderRadius: "5px" }}>
      
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
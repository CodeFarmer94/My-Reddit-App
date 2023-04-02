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
    <div style={{ backgroundColor: "#8a9dbd", display: "flex", justifyContent: "left", 
      padding: "0.8rem 0", border: "1px solid gray",borderTopLeftRadius:"5px" ,borderTopRightRadius:"5px"}}>
      
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
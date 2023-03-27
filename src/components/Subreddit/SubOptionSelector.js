import React from "react";
import { RiFireFill } from "react-icons/ri";
import { MdFiberNew } from "react-icons/md";
import { FaBolt } from "react-icons/fa";

import "./Subreddit.css";

export default function SubOptionSelector({ selectedSubOption, setSelectedSubOption }) {
  const onClick = (option) => {
    setSelectedSubOption(option);
    console.log(option);
  };

  return (
    <div style={{ backgroundColor: "white", display: "flex", justifyContent: "left", width: "96%", margin: "1rem auto", padding: "0.5rem 0", border: "1px solid gray", borderRadius: "5px" }}>
      
      
      <button className="options-btn"
       onClick={() => onClick("hot")} 
       style={{ backgroundColor: selectedSubOption === "hot" ? "##cfd1d4" : "##e1e4eb", color: selectedSubOption === "hot" ? "#7a11fa" : "gray" }}><RiFireFill/>Popular</button>
      <button 
      className="options-btn" 
      onClick={() => onClick("new")}
       style={{ backgroundColor: selectedSubOption === "new" ? "##cfd1d4" : "##e1e4eb", color: selectedSubOption === "new" ? "#7a11fa" : "gray" }}><MdFiberNew/>Recent</button>
      <button 
      className="options-btn" 
      onClick={() => onClick("rising")} 
      style={{ backgroundColor: selectedSubOption === "rising" ? "##cfd1d4" : "##e1e4eb", color: selectedSubOption === "rising" ? "#7a11fa" : "gray" }}><FaBolt />Rising</button>
    
    </div>
  );
}


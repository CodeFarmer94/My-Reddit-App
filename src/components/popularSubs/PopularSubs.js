import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
export default function PopularSubs({setSelectedSub}){

  const [subreddits, setSubreddits] = useState([]);
  
  useEffect(()=>{
 async function getPopularSubs() {
    const response = await fetch("https://www.reddit.com/subreddits/popular.json");
    const data = await response.json();
    setSubreddits(data.data.children);

  }
  getPopularSubs()

  },[])
 

    return (<div>

    <h2>Popular Subreddits</h2>
     <ul>
       {subreddits.map((subreddit) => (
         <li key={subreddit.data.id}>
           <h3>
             <Link to={`/r/${subreddit.data.display_name}`} >
               {subreddit.data.display_name}
             </Link>
           </h3>
           <a href={subreddit.data.url}>{subreddit.data.url}</a>
           <p><ReactMarkdown>{subreddit.data.title}</ReactMarkdown></p>
           <p><ReactMarkdown>{subreddit.data.public_description}</ReactMarkdown></p>
           <p>{subreddit.data.subscribers} subscribers</p>
         </li>
       ))}
     </ul>
   </div>
 );
}
import { useState, useEffect } from "react";
import getTimeDiff from "../../functions/getTimeDiff";
import { Link } from "react-router-dom";
import "./searchResults.css"
import { BiCommentDetail } from "react-icons/bi";
import { BiUpvote} from "react-icons/bi"
import { selectTheme } from "../../store/store";
import { useSelector } from "react-redux";
import { useCallback } from "react";
function SearchResults_Post({ postSearchResults}) {
  
  const theme = useSelector(selectTheme)

  
  // check if url is an image
  function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  }
  
  const [subredditIcons, setSubredditIcons] = useState({});
  
  const getSubredditIcons = useCallback(async()=> {
      
    const subredditNames = postSearchResults.map((post) => post.subreddit)
    const subredditNamesIconPairs = {}
    const subredditDataRequests = subredditNames.map(async(subreddit) =>{
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
    const data = await response.json()
    subredditNamesIconPairs[subreddit] = data.data.icon_img;
       }
    );
    await Promise.all(subredditDataRequests);
    setSubredditIcons(subredditNamesIconPairs)
  },[postSearchResults])

  useEffect(() => {
    
    getSubredditIcons();
  }, [postSearchResults,getSubredditIcons]);

  
  return (
    <div>
        {postSearchResults.map((post) => (
           <Link key={post.id} to={`/${post.subreddit}/post/${post.id}`} >
            <div className={theme === "dark" ? "bg2-dark-color post-results-container" 
            : "bg2-light-color post-results-container"}>
            <div className="post-results-column-flex">
            <div className="post-results-info"
            id={theme === "dark" ? "text-color-dark" : "text-color-light"}>
              {subredditIcons[post.subreddit] ? <img id="post-icon" src={subredditIcons[post.subreddit]} alt="" /> : null}
              <span>r/{post.author}</span>
              <p style={{color:theme === "dark" ? "white" : "black"}}>• {getTimeDiff(post.created_utc)}</p>
            </div>
            <div className="post-results-content">
              <p>{post.title}</p>
            </div>
            <div className="post-results-metadata">
                <BiCommentDetail/>
                <p>{post.num_comments} comments</p>
                <BiUpvote/>
                <p>{post.ups} upvotes</p></div>
            </div>
            {isImageUrl(post.thumbnail) && <img 
            src={post.thumbnail} id="post-image" alt="post-thumbnail"/>}

            </div>
            </Link>
        ))}
    </div>
  );
}

export default SearchResults_Post;



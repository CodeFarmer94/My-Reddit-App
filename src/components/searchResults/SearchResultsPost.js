import { useState, useEffect } from "react";
import getTimeDiff from "../../functions/getTimeDiff";
import { Link } from "react-router-dom";
import "./searchResults.css"
import { BiCommentDetail } from "react-icons/bi";
import { BiUpvote} from "react-icons/bi"
import { selectTheme } from "../../app/store";
import { useSelector } from "react-redux";

function SearchResults_Post({ postSearchResults}) {
  
  const theme = useSelector(selectTheme)
  // Users cached Icons
  const [subredditIcons, setSubredditIcons] = useState({});
  console.log(postSearchResults)
  // check if url is an image
  function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  }

  // Get users icons and store in state
  useEffect(() => {
    console.log(postSearchResults)
    async function getSubredditIcons() {
      
      const subredditNames = new Set(postSearchResults.map((post) => post.subreddit));
      const subredditDataRequests = Array.from(subredditNames).map((subreddit) =>
        fetch(`https://www.reddit.com/r/${subreddit}/about.json`).then((response) =>
          response.json()
        )
      );
      const subredditIcons = await Promise.all(subredditDataRequests);
      const subredditIconMap = {};
      subredditIcons.forEach((subreddit) => {
        subredditIconMap[subreddit.data.display_name] = subreddit.data.icon_img;
      });
      setSubredditIcons(subredditIconMap);
    }
    getSubredditIcons();
  }, [postSearchResults]);

  
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



import { useState, useEffect } from "react";
import getTimeDiff from "../../features/getTimeDiff";
import { Link } from "react-router-dom";

function SearchResults_Post({ postSearchResults, searchTerm ,setSelectedSub}) {
  const [subredditIcons, setSubredditIcons] = useState({});


  useEffect(() => {
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
           <Link key={post.id} to={`${post.subreddit}/posts/${post.id}`} >
            <div className="post-results-container" >
            <div className="post-results-info">
              {subredditIcons[post.subreddit] ? <img id="post-icon" src={subredditIcons[post.subreddit]} alt="" /> : null}
              <span>r/{post.author}</span>
              <p>• {getTimeDiff(post.created_utc)}</p>
            </div>
            <div className="post-results-content">
              <h4>{post.title}</h4>
              
            </div>
            </div>
            </Link>
        ))}
    </div>
  );
}

export default SearchResults_Post;



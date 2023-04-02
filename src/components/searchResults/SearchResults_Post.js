import { useState, useEffect } from "react";
import getTimeDiff from "../../features/getTimeDiff";
import { Link } from "react-router-dom";
import "./searchResults.css"
import { BiCommentDetail } from "react-icons/bi";
import { BiUpvote} from "react-icons/bi"
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
            <div className="post-results-container">
            <div className="post-results-column-flex">
            <div className="post-results-info">
              {subredditIcons[post.subreddit] ? <img id="post-icon" src={subredditIcons[post.subreddit]} alt="" /> : null}
              <span>r/{post.author}</span>
              <p>• {getTimeDiff(post.created_utc)}</p>
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
            {post.thumbnail !== "self" && <img style={{width: post.thumbnail_width, height:post.thumbnail_height}}
            src={post.thumbnail} id="post-image" alt="post-thumbnail"/>}

            </div>
            </Link>
        ))}
    </div>
  );
}

export default SearchResults_Post;



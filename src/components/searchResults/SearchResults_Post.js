import { useState, useEffect } from "react";

function SearchResults_Post({ postSearchResults, searchTerm }) {
  const [subredditIcons, setSubredditIcons] = useState({});

  useEffect(() => {
    async function getSubredditIcons() {
      const subredditNames = new Set(postSearchResults.map((post) => post.subreddit));
      const subredditIconRequests = Array.from(subredditNames).map((subreddit) =>
        fetch(`https://www.reddit.com/r/${subreddit}/about.json`).then((response) =>
          response.json()
        )
      );
      const subredditIcons = await Promise.all(subredditIconRequests);
      const subredditIconMap = subredditIcons.reduce((map, subreddit) => {
        map[subreddit.data.display_name] = subreddit.data.icon_img;
        return map;
      }, {});
      setSubredditIcons(subredditIconMap);
    }
    getSubredditIcons();
  }, [postSearchResults]);

  return (
    <div>
      <h2>Posts matching "{searchTerm}":</h2>
      <ul>
        {postSearchResults.map((post) => (
          <li key={post.id}>
            <div className="postAuthor">
              <img src={subredditIcons[post.subreddit]} alt="" />
              <span>{post.author}</span>
            </div>
            <div className="postContent">
              <a href={post.url}>{post.title}</a>
              <p>{post.selftext}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults_Post;


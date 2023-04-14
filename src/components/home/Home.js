import React from "react";
import { Link } from "react-router-dom";
import getTimeDiff from "../../functions/getTimeDiff";
import { useState, useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { BiUpvote } from "react-icons/bi";
import OptionSelector from "../optionSelector/OptionSelector";
import SubListBox from "../subListBox/SubListBox";
import { useSelector } from "react-redux";
import { selectTheme } from "../../app/store";

export default function Home({ setSelectedSub, accessToken }) {
  const [subredditIcons, setSubredditIcons] = useState({});
  const [posts, setPosts] = useState([]);
  const [trendingSubreddits, setTrendingSubreddits] = useState(null);
  const [homeOption, setHomeOption] = useState("best");
  const theme = useSelector(selectTheme);
   // Function to check if a URL is an image
   function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  }

  useEffect(() => {
    // Fetch trending subreddits and set state
    
    async function getTrendingSubreddits() {
      const response = await fetch(
        "https://www.reddit.com/subreddits/popular.json"
      );
      const data = await response.json();
      console.log(data.data.children);
      setTrendingSubreddits(data.data.children);
    }
      getTrendingSubreddits();
  }, []);

  useEffect(() => {
    // Fetch popular posts and set state
    async function getPopularPosts() {
      const response = await fetch(
        `https://www.reddit.com/r/popular/${homeOption}.json`
      );
      const data = await response.json();
      console.log(data.data.children);
      setPosts(data.data.children);
    }
    getPopularPosts();
  }, [homeOption]);

  useEffect(() => {
    // Fetch subreddit icons for posts and set state
    async function getSubredditIcons() {
      const subredditNames = new Set(posts.map((post) => post.data.subreddit));
      const subredditDataRequests = Array.from(subredditNames).map(
        (subreddit) =>
          fetch(`https://www.reddit.com/r/${subreddit}/about.json`).then(
            (response) => response.json()
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
  }, [posts]);
  return (
    <main>
      <div className="info-section">
        <SubListBox
          subRedditsList={trendingSubreddits}
          setSelectedSub={setSelectedSub}
          boxTitle={"Popular Subreddits"}
        />
      </div>
      <div className="post-section">
        <OptionSelector
          selectedSubOption={homeOption}
          setSelectedSubOption={setHomeOption}
          optionsObject={{ option1: "best", option2: "new", option3: "top" }}
        />

        {posts.map((post) => (
          <Link
            key={post.data.id}
            to={`/${post.data.subreddit}/post/${post.data.id}`}
          >
            <div
              className={
                theme === "dark"
                  ? "bg2-dark-color post-results-container"
                  : "bg2-light-color post-results-container"
              }
            >
              <div className="post-results-column-flex">
                <div
                  className="post-results-info"
                  id={theme === "dark" ? "text-color-dark" : "text-color-light"}
                >
                  <Link to={`/r/${post.data.subreddit}`} className="flex-row">
                    {subredditIcons[post.data.subreddit] ? (
                      <img
                        className="sl-icon"
                        src={subredditIcons[post.data.subreddit]}
                        alt=""
                      />
                    ) : null}
                    <p
                      id={
                        theme === "dark"
                          ? "text2-color-dark"
                          : "text2-color-light"
                      }
                    >
                      <strong>{post.data.subreddit}</strong>
                    </p>
                  </Link>
                  <span>r/{post.data.author}</span>
                  <p style={{ color: theme === "dark" ? "white" : "black" }}>
                    • {getTimeDiff(post.data.created_utc)}
                  </p>
                </div>
                <div className="post-results-content">
                  <p>{post.data.title}</p>
                </div>
                {isImageUrl(post.data.thumbnail) && (
                <img
                  style={{
                    width: post.data.thumbnail_width,
                    height: post.thumbnail_height,
                    margin: "1rem auto"
                  }}
                  src={post.data.thumbnail}
                  id="post-image"
                  className="no-desktop"
                  alt="post-thumbnail"
                />
              )}
                <div
                  className="post-results-metadata"
                  style={{ color: theme === "dark" ? "lightblue" : "gray" }}
                >
                  <BiCommentDetail />
                  <p>{post.data.num_comments} comments</p>
                  <BiUpvote />
                  <p>{post.data.ups} upvotes</p>
                </div>
              </div>
              {isImageUrl(post.data.thumbnail) && (
                <img
                  style={{
                    width: post.data.thumbnail_width,
                    height: post.thumbnail_height,
                  }}
                  src={post.data.thumbnail}
                  id="post-image"
                  className="no-mobile"
                  alt="post-thumbnail"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

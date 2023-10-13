import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import getTimeDiff from "../../functions/getTimeDiff";
import { BiCommentDetail } from "react-icons/bi";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import RedditLogo from "../../images/RedditLogo.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/store";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import "./post.css";

export default function Post() {
  // declare local State
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [avatars, setAvatars] = useState({});
  const [postSubredditData, setPostSubredditData] = useState();
  const [replyAvatars, setReplyAvatars] = useState({});
  const [error, setError] = useState(null)
  const theme = useSelector(selectTheme);
  // retreive id from url bar
  const pathname = window.location.pathname;
  const parts = pathname.split("/");
  const id = parts[3];
  const subreddit = parts[1];

  // check if url is an image
  function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  }

  // Scroll to top of the screen 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get Data about the current post's subreddit
  useEffect(() => {
    
    async function getSubredditData() {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/about.json?flair_enabled=true`
      );
      const data = await response.json();
      if(data.error){
        setError(data.error)
        return
      }
      setPostSubredditData(data);
    }

    async function getPostData() {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/comments/${id}.json`
      );
      const data = await response.json();
      if(data.error){
        setError(data.error)
        return
      }
      setPost(data[0].data.children[0].data);
      setComments(data[1].data.children);

    }
    getPostData();
    getSubredditData();
  }, [id, subreddit]);

  // Get Avatar of eacth user that has commented
  const getUserAvatar = useCallback(async (user) => {
    try{
         const response = await fetch(
      `https://www.reddit.com/user/${user}/about.json`
    );
    const data = await response.json();
    if(data){
    const avatarUrl = data.data.snoovatar_img;
    setAvatars((avatars) => ({
      ...avatars,
      [user]: avatarUrl,
    }));
    }
    } catch(error){
      throw new Error('getUserAvatar Failed')
    }
 
    
   
  }, [setAvatars]);

  
  useEffect(() => {
    if (comments) {
      comments.forEach((comment) => {
        const user = comment.data.author;
          getUserAvatar(user);
        }
      )
    }
  }, [comments, getUserAvatar]);
  
  // Get Avatar of each users that has replied
  const getReplyAvatar = useCallback(async (reply) => {
    const response = await fetch(
      `https://www.reddit.com/user/${reply.data.author}/about.json`
    );
    const data = await response.json();
    const avatarUrl = data.data.snoovatar_img;
    setReplyAvatars((replyAvatars) => ({
      ...replyAvatars,
      [reply.data.id]: avatarUrl,
    }));
  }, []);

  useEffect(() => {
    if (comments) {
      comments.forEach((comment) => {
        if (comment.data.replies) {
          comment.data.replies.data.children.forEach((reply) => {
              getReplyAvatar(reply);
            
          });
        }
      });
    }
  }, [comments, getReplyAvatar]);
  return (
    <div
      className={
        theme === "dark"
          ? "bg2-dark-color post-page-container"
          : "bg2-light-color post-page-container"
      }
    > 
      { !error ? post && (
        <div>
          <div className="post-container">
            <div className="post-column-flex">
              <div className="post-info">
                <Link to={`/r/${post.subreddit}`} className="flex-row">
                  {postSubredditData.data.icon_img && (
                    <img
                      src={postSubredditData.data.icon_img}
                      className="sl-icon"
                      alt="subreddit icon"
                    />
                  )}
                  <p
                    id={
                      theme === "dark"
                        ? "text2-color-dark"
                        : "text2-color-light"
                    }
                  >
                    <strong>{post.subreddit}</strong>
                  </p>
                </Link>
                <p>
                  Posted by{" "}
                  <span id={theme === "dark" ? "text-color-dark" : ""}>
                    <strong>r/{post.author}</strong>
                  </span>
                  • {getTimeDiff(post.created_utc)}
                </p>
              </div>
              <div className="post-content">
                <h3>{post.title}</h3>
                {isImageUrl(post.url) ? (
                  <img src={post.url} alt="post" id="post-page-image" />
                ) : isImageUrl(post.thumbnail) ? <img src={post.thumbnail} alt="post" id="post-page-image-small" /> : null}

                {post.secure_media && post.secure_media.reddit_video ? (
                  <video
                    src={post.secure_media.reddit_video.fallback_url}
                    id="post-video"
                    controls
                  />
                ) : null}
              </div>
              <div
                className="post-metadata"
                style={{ color: theme === "dark" ? "lightblue" : "gray" }}
              >
                <BiCommentDetail />
                <p>{post.num_comments} comments</p>
                <BiUpvote />
                <p>{post.ups} upvotes</p>
              </div>
            </div>
          </div>
        </div>
      ) :  /*DISPLAY WARNING INSTEAD */
      <h1 style={{margin:'auto', padding:'5rem', color:theme === 'dark' ? 'yellow' : 'black', border:'2px solid white',}}>API calls limit exceeded: Since July 2023 Reddit is limiting third party apps API calls 
          Sorry for the inconvinience.</h1>}

      {comments && (
        <div className="comments-container">
          {comments.map(function (comment,index) {
            const user = comment.data.author;
            const avatarUrl = avatars[user];

            return (
              <div key={index} className="comment-container">
                <div className="comment-flex-row">
                  {
                    <img
                      src={avatarUrl ? avatarUrl : RedditLogo}
                      alt={user}
                      id="avatar-icon"
                    />
                  }
                  <p
                    id={
                      theme === "dark" ? "text-color-dark" : "text2-color-light"
                    }
                  >
                    <strong>{user}</strong>
                    <span>{comment.data.is_submitter ? "AUTHOR" : ""}</span>
                  </p>
                  <p style={{color: theme === "dark" ? "white" : "gray"}}>
                    • {getTimeDiff(comment.data.created_utc)}
                  </p>
                  {comment.data.all_awardings &&
                    comment.data.all_awardings.map((icon) => (
                      <img src={icon.icon_url} id="award-icon" alt="" />
                    ))}
                </div>
                <div className="comment-content">
                  <ReactMarkdown>{comment.data.body}</ReactMarkdown>
                  <div
                    className="comment-stats"
                    style={{ color: theme === "dark" ? "lightblue" : "gray" }}
                  >
                    <p>
                      <BiUpvote />
                      {comment.data.ups} Upvotes
                    </p>
                    <p>
                      <BiDownvote />
                      {comment.data.downs} Downvotes
                    </p>
                  </div>

                  <div className="comment-replies-container">
                    {comment.data.replies
                      ? comment.data.replies.data.children.map(function (
                          reply
                        ) {
                          const replyId = reply.data.id;
                          const replyAvatarUrl = replyAvatars[replyId];

                          return (
                            <div>
                              <div
                                className="comment-flex-row"
                                id={
                                  theme === "dark"
                                    ? "text-color-dark"
                                    : "text2-color-light"
                                }
                              >
                                <img
                                  src={
                                    replyAvatarUrl ? replyAvatarUrl : RedditLogo
                                  }
                                  alt={reply.data.author}
                                  id="avatar-icon"
                                />
                                <p>
                                  <strong>{reply.data.author}</strong>
                                  <span>
                                    {reply.data.is_submitter ? "AUTHOR" : ""}
                                  </span>
                                </p>
                                <p style={{color: theme === "dark" ? "white" : "gray"}}>
                                  • {getTimeDiff(reply.data.created_utc)}
                                  </p>
                              </div>
                              <div className="comment-content">
                                <ReactMarkdown>{reply.data.body}</ReactMarkdown>
                                <div
                                  className="comment-stats"
                                  style={{
                                    color:
                                      theme === "dark" ? "lightblue" : "gray",
                                  }}
                                >
                                  <p>
                                    <BiUpvote />
                                    {reply.data.ups} Upvotes
                                  </p>
                                  <p>
                                    <BiDownvote />
                                    {reply.data.downs} Downvotes
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
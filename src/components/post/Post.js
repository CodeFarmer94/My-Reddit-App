import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import getTimeDiff from "../../functions/getTimeDiff";
import { BiCommentDetail } from "react-icons/bi";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import RedditLogo from "../../images/RedditLogo.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../app/store";
import { Link } from "react-router-dom";
import "./post.css";

export default function Post() {
  // declare local State
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [avatars, setAvatars] = useState({});
  const [postSubredditData, setPostSubredditData] = useState();
  const [replyAvatars, setReplyAvatars] = useState({});
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
      console.log(data);
      setPostSubredditData(data);
    }
    async function getPostData() {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/comments/${id}.json`
      );
      const data = await response.json();
      setPost(data[0].data.children[0].data);
      setComments(data[1].data.children);
    }
    getPostData();
    getSubredditData();
  }, [id, subreddit]);

  // Get Avatar of eacth user that has commented
  useEffect(() => {
    async function getUserAvatar(user) {
      const response = await fetch(
        `https://www.reddit.com/user/${user}/about.json`
      );
      const data = await response.json();
      const avatarUrl = data.data.snoovatar_img;
      setAvatars((avatars) => ({
        ...avatars,
        [user]: avatarUrl,
      }));
    }
    if (comments) {
      comments.forEach((comment) => {
        const user = comment.data.author;
        if (!avatars[user]) {
          getUserAvatar(user);
        }
      });
    }
  }, [comments]);

  // Get Avatar of each users that has replied
  useEffect(() => {
    async function getReplyAvatar(reply) {
      const response = await fetch(
        `https://www.reddit.com/user/${reply.data.author}/about.json`
      );
      const data = await response.json();
      const avatarUrl = data.data.snoovatar_img;
      setReplyAvatars((replyAvatars) => ({
        ...replyAvatars,
        [reply.data.id]: avatarUrl,
      }));
    }

    if (comments) {
      comments.forEach((comment) => {
        if (comment.data.replies) {
          comment.data.replies.data.children.forEach((reply) => {
            const replyId = reply.data.id;
            if (!replyAvatars[replyId]) {
              getReplyAvatar(reply);
            }
          });
        }
      });
    }
  }, [comments]);
  return (
    <div
      className={
        theme === "dark"
          ? "bg2-dark-color post-page-container"
          : "bg2-light-color post-page-container"
      }
    >
      {post && (
        <div>
          <div className="post-container">
            <div className="post-column-flex">
              <div className="post-info">
                <Link to={`/r/${post.subreddit}`} className="flex-row">
                  {postSubredditData.data.icon_img && (
                    <img
                      src={postSubredditData.data.icon_img}
                      className="sl-icon"
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
                  <img src={post.url} alt="post-image" id="post-page-image" />
                ) : null}

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
      )}
      {comments && (
        <div className="comments-container">
          {comments.map(function (comment) {
            const user = comment.data.author;
            const avatarUrl = avatars[user];

            return (
              <div key={comment.data.id} className="comment-container">
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
                  <p>• {getTimeDiff(comment.data.created_utc)}</p>
                  {comment.data.all_awardings &&
                    comment.data.all_awardings.map((icon) => (
                      <img src={icon.icon_url} id="award-icon" />
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
                                <p>• {getTimeDiff(reply.data.created_utc)}</p>
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
import { Link } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { BiCommentDetail } from "react-icons/bi";
import RedditLogo from "../../../images/RedditLogo2.png";
import "./listOfSubPosts.css";
import { selectTheme } from "../../../app/store";
import { useSelector } from "react-redux";
export default function ListOfSubsPosts({ selectedSubPosts }) {


  const theme = useSelector(selectTheme)

  function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
  }

  return (
    <div>
      {selectedSubPosts.map((post, index) => (
        <Link key={index} to={`/${post.data.subreddit}/post/${post.data.id}`}>
          <div key={index} className= {theme === "dark" ? "bg2-dark-color posts-container" : "bg2-light-color posts-container"}>
            {isImageUrl(post.data.thumbnail) &&
            !isImageUrl(post.data.url_overridden_by_dest) ? (
              <div className="thumbnail-container">
                <img
                  src={post.data.thumbnail}
                  alt="thumbnail"
                  className="thumbnail-img"
                />
              </div>
            ) : (
              <div className="thumbnail-container">
                <img
                  src={RedditLogo}
                  alt="thumbnail"
                  className="thumbnail-img"
                />
              </div>
            )}
            <div className="post-content">
              <p className="post-author">
                Posted by: <strong id= {theme==="dark" ? "text2-color-dark" : "text2-color-light"}>u/{post.data.author}</strong>
              </p>
              <h3 className="post-title">
                {post.data.link_flair_text ? (
                  <span className="post-author-flair">
                    {post.data.link_flair_text}
                  </span>
                ) : (
                  ""
                )}
                <ReactMarkdown>{post.data.title}</ReactMarkdown>
              </h3>

              {post.data.url_overridden_by_dest &&
                (isImageUrl(post.data.url_overridden_by_dest) ? (
                  <img
                    src={post.data.url_overridden_by_dest}
                    alt={post.title}
                    className="sub-list-post-img"
                  />
                ) : null)}
              <div className="sub-post-list-metadata"
              style={{color: theme === "dark" ? "lightblue" : "gray"}}>
                <BiCommentDetail className="comment-icon" />
                <p className="post-metadata-text">
                  {post.data.num_comments} Comments
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
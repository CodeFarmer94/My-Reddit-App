import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { BiCommentDetail } from "react-icons/bi";
import RedditLogo from "../../images/RedditLogo2.png";

import "./Subreddit.css";

export default function ListOfSubsPosts({
    selectedSubPosts,
    selectedSubData,
    selectedSub,
}) {
    function isImageUrl(url) {
        return /\.(jpeg|jpg|gif|png)$/i.test(url);
    }

    return (
        <div>
            {selectedSubPosts.map((post, index) => (
                <Link key={index} to={`/posts/${post.data.id}`}>
                    <div
                        key={index}
                        className="post-container"
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        {isImageUrl(post.data.thumbnail) &&
                        !isImageUrl(post.data.url_overridden_by_dest) ? (
                            <div className="thumbnail-container">
                                <img
                                    src={post.data.thumbnail}
                                    alt="thumbnail"
                                    className="thumbnail-image"
                                    style={{
                                        maxHeight: "100px",
                                        minHeight: "80px",
                                        maxWidth: "100px",
                                        minWidth: "80px",
                                        margin: "0 1rem 0 0",
                                        alignSelf: "top",
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="thumbnail-container">
                                <img
                                    src={RedditLogo}
                                    alt="thumbnail"
                                    className="thumbnail-image"
                                    style={{
                                        maxHeight: "100px",
                                        minHeight: "80px",
                                        maxWidth: "100px",
                                        minWidth: "80px",
                                        margin: "0 1rem 0 0",
                                    }}
                                />
                            </div>
                        )}
                        <div className="post-content">
                            <p
                                style={{
                                    display: "inline-block",
                                    fontSize: "0.9rem",
                                    color: "gray",
                                }}
                            >
                                Posted by: u/{post.data.author}
                            </p>
                            <h2
                                style={{
                                    margin: "0.4rem 0",
                                    color: "black",
                                    fontWeight: "500",
                                }}
                            >
                                {post.data.link_flair_text ? (
                                    <span
                                        style={{
                                            backgroundColor: "#d5dbe3",
                                            color: "#7a11fa",
                                            padding: "0.1rem 0.4rem",
                                            borderRadius: "5px",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {post.data.link_flair_text}
                                    </span>
                                ) : (
                                    ""
                                )}
                                <ReactMarkdown>{post.data.title}</ReactMarkdown>
                            </h2>

                            {post.data.url_overridden_by_dest &&
                                (isImageUrl(
                                    post.data.url_overridden_by_dest
                                ) ? (
                                    <img
                                        src={post.data.url_overridden_by_dest}
                                        alt={post.title}
                                        style={{ maxHeight: "500px" }}
                                    />
                                ) : (
                                    <a
                                        href={post.data.url_overridden_by_dest}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {post.title}
                                    </a>
                                ))}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "0.5rem",
                                }}
                            >
                                <BiCommentDetail
                                    style={{
                                        fontSize: "1.2rem",
                                        marginRight: "0.3rem",
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "gray",
                                    }}
                                >
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

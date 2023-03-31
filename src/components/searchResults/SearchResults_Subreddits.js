
import React from "react";
import { useEffect,useState } from "react";
export default function SearchResults_Subreddits({searchTerm,subredditSearchResults }) {





  return (
    <div>
      <h2>Results for "{searchTerm}"</h2>
      <ul>
        {subredditSearchResults.map((subreddit) => (
          <li key={subreddit.id}>
            <a href={`https://www.reddit.com/${subreddit.display_name}`}>{subreddit.display_name_prefixed}</a>
            <br />
            <strong>Subscribers:</strong> {subreddit.subscribers} |{" "}
            <strong>Active users:</strong> {subreddit.active_user_count} |{" "}
            <strong>Public:</strong> {subreddit.public ? "Yes" : "No"}
            <br />
            {subreddit.description && (
              <>
                <strong>Description:</strong> {subreddit.description}
                <br />
              </>
            )}
            <strong>Created:</strong>{" "}
            {new Date(subreddit.created_utc * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

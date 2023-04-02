
import React from "react";
import { truncateText } from "../../features/truncateText";
import "./searchResults.css"
import RedditLogo from "../../images/RedditLogo.png";
export default function SearchResults_Subreddits({subredditSearchResults }) {

 

  return (
    <div>
        {subredditSearchResults.map((subreddit) => (
          <div key={subreddit.id} className="subreddit-results-container">
            <div className="flex-row">
              <img id ="sub-results-icon-img" src={subreddit.icon_img ? subreddit.icon_img : RedditLogo} alt="subreddit-icon" />
              <div className="sub-results-info">
                <p><strong>{subreddit.display_name_prefixed}</strong></p>
              <p>{typeof subreddit.public_description === "string" ? truncateText(subreddit.public_description,100) :"" }</p></div>
            </div>
          
          </div>
        ))}
     
    </div>
  );
}

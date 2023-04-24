
import React from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../../functions/truncateText";
import "./searchResults.css"
import RedditLogo from "../../images/RedditLogo.png";
import { selectTheme } from "../../store/store";
import { useSelector } from "react-redux";
export default function SearchResults_Subreddits({subredditSearchResults }) {

  const theme= useSelector(selectTheme)

  return (
    <div>
        {subredditSearchResults.map((subreddit) => (
          <Link key={subreddit.id} to={`/r/${subreddit.display_name}`}>
          <div className={theme === "dark" ? "bg2-dark-color subreddit-results-container" 
            : "bg2-light-color subreddit-results-container"}>
            <div className="flex-row">
              <img className="sl-icon" src={subreddit.icon_img ? subreddit.icon_img : RedditLogo} alt="subreddit-icon" />
              <div className="sub-results-info"
              >
                <p id={
                        theme === "dark"
                          ? "text-color-dark"
                          : "text2-color-light"
                      }><strong>{subreddit.display_name_prefixed}</strong></p>
              <p>{typeof subreddit.public_description === "string" ? truncateText(subreddit.public_description,100) :"" }</p></div>
            </div>
          
          </div></Link>
        ))}
     
    </div>
  );
}

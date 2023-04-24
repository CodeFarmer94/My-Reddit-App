
import { Link } from "react-router-dom";
import { truncateText } from "../../functions/truncateText";
import RedditLogo from "../../images/RedditLogo.png";
import { selectTheme } from "../../store/store";
import { useSelector } from "react-redux";
export default function SubListBox({ boxTitle, setSelectedSub,subRedditsList }) {
  
  const theme = useSelector(selectTheme)

  return (
    <div className="info-box">
      <div
        className=   {theme === "dark" ? "bg3-dark-color subreddit-results-container" : " light-theme-color subreddit-results-container "}
      >
        <h4 style={{ marginLeft: "1rem", color: "white" }}>
          {boxTitle}
        </h4>
      </div>
      <div>
        {subRedditsList && subRedditsList.map((subreddit) => (
          <Link
            key={subreddit.data.id}
            to={`/r/${subreddit.data.display_name}`}
          >
            <div
              className={theme === "dark" ? "bg2-dark-color subreddit-results-container" : " bg2-light-color subreddit-results-container "}
              onClick={() => setSelectedSub(subreddit.data.display_name)}
            >
              <div className="flex-row">
                <img
                  className="sl-icon"
                  src={
                    subreddit.data.icon_img
                      ? subreddit.data.icon_img
                      : RedditLogo
                  }
                  alt="subreddit-icon"
                />
                
                  <div className="text-left">
                  <strong>{subreddit.data.display_name_prefixed}</strong>
                  <p>{typeof subreddit.data.public_description === "string" ? truncateText(subreddit.data.public_description,50) :"" }</p>
                
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

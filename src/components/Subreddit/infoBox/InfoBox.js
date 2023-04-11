import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { FaHeart } from "react-icons/fa";
import { selectTheme } from "../../../app/store";
import { useSelector } from "react-redux";
import { getContrastColor } from "../../../functions/getContrastColor";
import {
  addFavSubToStore,
  selectUserFavSubs,
  removeFavSubFromStore,
} from "../../../app/store";
import "./infoBox.css"

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";


export default function InfoSection({ selectedSubData }) {
  // State setting and hooks calls
  const [isSubFavorite, setIsSubFavorite] = useState(false);
  const favoriteSubs = useSelector(selectUserFavSubs);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme)
  // Setting isFavorite State if Subreddit is present in favoriteSubs
  useEffect(() => {
    if (selectedSubData && favoriteSubs.length !== 0) {
      setIsSubFavorite(
        favoriteSubs.some(
          (subreddit) =>
            subreddit.data.display_name === selectedSubData.data.display_name
        )
      );
    }
  }, [selectedSubData, favoriteSubs]);

  // Async Function  to add sub to user reddit account
  async function addSubToReddit(subreddit) {
     await fetch(
      `https://oauth.reddit.com/api/subscribe?action=sub&sr_name=${subreddit}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "reddit_access_token"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(addFavSubToStore(selectedSubData));
  }

  // Async Function t to remove sub from user reddit account
  async function removeSubFromReddit(subreddit) {
     await fetch(
      `https://oauth.reddit.com/api/subscribe?action=unsub&sr_name=${subreddit}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "reddit_access_token"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );
   
    console.log(subreddit);
    dispatch(removeFavSubFromStore(selectedSubData));
  }

  // Add/Remove sub on button click
  const handleClick = (subreddit) => {
    if (isSubFavorite) {
      removeSubFromReddit(subreddit);
    } else {
      addSubToReddit(subreddit);
    }
  };

  // Extracting data from selectedSubData fetch call
  const primaryColor = selectedSubData.data.primary_color
    ? selectedSubData.data.primary_color
    : "#063970";
  const contrastColor = getContrastColor(primaryColor);
  const timestamp = selectedSubData.data.created_utc;
  let date = new Date(timestamp * 1000);
  const descriptionText = selectedSubData.data.public_description;
  let creationDate = date.toLocaleDateString(); 
  const subscribers = selectedSubData.data.subscribers;
  const active_users = selectedSubData.data.active_user_count;

  return (
    <div >
      <div className={theme === "dark" ? "info-box bg2-dark-color" : "info-box bg2-light-color"}>
        <div
          className="info-span text-left"
          style={{ backgroundColor: primaryColor}}
        >
          <h4 style={{ marginLeft: "1rem", color: contrastColor }}>
            Informazioni
          </h4>
        </div>
        <p className="description-text">
          <ReactMarkdown>{descriptionText}</ReactMarkdown>
        </p>
        <div className="btn-container"
        >
          <button
            onClick={() => handleClick(selectedSubData.data.display_name)}
            className="options-btn"
            style={{ color: isSubFavorite ? "#d10228" : "black", margin: "auto" }}
          >
            <FaHeart />
            <span style={{marginLeft:"0.2rem"}}>Favorite</span>
          </button>
          Creato il {creationDate}
        </div>
        <div className="flex-row"
          style={{
            margin: "0.6rem",
          }}
        >
          <p className="flex-col margin-auto"
          >
            <div>Followers</div>
            <div ><strong>{subscribers}</strong></div>
          </p>
          <p className="flex-col margin-auto"
          >
            <div>Active Users</div>
            <div> <strong>{active_users}</strong></div>
          </p>
        </div>
      </div>
    </div>
  );
}
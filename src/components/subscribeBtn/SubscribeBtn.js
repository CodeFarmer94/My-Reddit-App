import { useEffect,useState } from "react";
import {
    addFavSubToStore,
    selectUserFavSubs,
    removeFavSubFromStore,
  } from "../../store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/store";


export default function SubscribreBtn({ selectedSubData}){

    const [isSubFavorite, setIsSubFavorite] = useState(false);
    const favoriteSubs = useSelector(selectUserFavSubs);
    const dispatch = useDispatch()
    const theme = useSelector(selectTheme)
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
      
       dispatch(removeFavSubFromStore(selectedSubData));
     }
     
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
 const handleClick = (subreddit) => {
    if (isSubFavorite) {
      removeSubFromReddit(subreddit);
    } else {
      addSubToReddit(subreddit);
    }
  };
  return(
    <button
            onClick={() => handleClick(selectedSubData.data.display_name)}
            className="subscribe-btn"
            style={{backgroundColor: theme === "dark" ? "rgba(70, 185, 234, 0.822)" : "rgba(4, 22, 56, 0.795)" }}
          >
            <span style={{marginLeft:"0.2rem"}}>{isSubFavorite ? "Subscribed" : "Follow"}</span>
          </button>

  )
}
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import "./Subreddit.css";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getContrastColor } from "../../features/getContrastColor";
import { getRandomColor } from "../../features/getRandomColor";
import { addFavSubToStore,selectUserFavSubs,removeFavSubFromStore } from "../../app/store";
import { useDispatch } from "react-redux";
import { useEffect,useState } from "react";

export default function InfoSection({
    selectedSubData,
    setSelectedSub,
}) {

    // State setting and hooks calls
    const  [isSubFavorite,setIsSubFavorite] = useState(false)
    const favoriteSubs = useSelector(selectUserFavSubs);
    const dispatch = useDispatch()

    // Setting isFavorite State if Subreddit is present in favoriteSubs
    useEffect(() => {
        if(selectedSubData && favoriteSubs.length !== 0){
              setIsSubFavorite(
          favoriteSubs.some(
            (subreddit) =>
              subreddit.data.display_name === selectedSubData.data.display_name
          )
        );  
            }
      }, [selectedSubData.data.display_name, favoriteSubs]);
     
      
     // Async Function  to add sub to user reddit account
    async function addSubToReddit(subreddit) {
        const response = await fetch(`https://oauth.reddit.com/api/subscribe?action=sub&sr_name=${subreddit}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("reddit_access_token")}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        console.log(subreddit)
        dispatch(addFavSubToStore(selectedSubData))
      }

      // Async Function t to remove sub from user reddit account
      async function removeSubFromReddit(subreddit) {
        const response = await fetch(`https://oauth.reddit.com/api/subscribe?action=unsub&sr_name=${subreddit}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("reddit_access_token")}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        console.log(subreddit)
        dispatch(removeFavSubFromStore(selectedSubData))
      }

      // Add/Remove sub on button click
        const handleClick = (subreddit) =>{
            if(isSubFavorite){
            removeSubFromReddit(subreddit)
            }
            else{
            addSubToReddit(subreddit)
            }
            } 


      // Extracting data from selectedSubData fetch call
        const primaryColor = selectedSubData.data.primary_color
            ? selectedSubData.data.primary_color
            : "#063970";
        const contrastColor = getContrastColor(primaryColor);
        const timestamp = selectedSubData.data.created_utc;
        let date = new Date(timestamp * 1000);
        const descriptionText = selectedSubData.data.public_description;
        let creationDate = date.toLocaleDateString(); // Output: "01/13/2014"
        const subscribers = selectedSubData.data.subscribers;
        const active_users = selectedSubData.data.active_user_count;

    
    return (
        <div className="info-section">
            <div className="info-box">
                <div
                    className="info-span"
                    style={{ backgroundColor: primaryColor, textAlign: "left" }}
                >
                    <h4 style={{ marginLeft: "1rem", color: contrastColor }}>
                        Informazioni
                    </h4>
                </div>
                <p style={{ padding: "1rem",textAlign:"justified" }}>
                    <ReactMarkdown>{descriptionText}</ReactMarkdown>
                </p>
                <p
                    style={{
                        fontSize: "0.9rem",
                        color: "gray",
                        textAlign: "center",
                        paddingLeft: "1rem",
                        paddingBottom: "1rem",
                        borderBottom: "0.8px solid gray",
                    }}
                >
                    <button onClick={()=>handleClick(selectedSubData.data.display_name)} className="options-btn" 
                    style={{color: isSubFavorite ? "red":"black",
                        margin:"auto"}}>
                        <FaHeart />
                        Favorite
                    </button>
                    Creato il {creationDate}
                </p>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "0.6rem",
                    }}
                >
                    <p
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                        }}
                    >
                        <div>Followers</div>
                        <div style={{ fontWeight: "bold" }}>{subscribers}</div>
                    </p>
                    <p
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                        }}
                    >
                        <div>Active Users</div>
                        <div style={{ fontWeight: "bold" }}>{active_users}</div>
                    </p>
                </div>
            </div>
            <div>
                <div className="info-box">
                    <div
                        className="info-span"
                        style={{
                            backgroundColor: primaryColor,
                            textAlign: "left",
                        }}
                    >
                        <h4
                            style={{ marginLeft: "1rem", color: contrastColor }}
                        >
                            Favorite Subreddits
                        </h4>
                    </div>
                    <p style={{ padding: "1rem", textAlign: "left" }}>
                        
                        {favoriteSubs.length !== 0
                            ? favoriteSubs.map((subreddit, index) => {
                                  
                                const randomColor = getRandomColor()  


                                  return( <Link
                                      key={index}
                                      to={`/r/${subreddit.data.display_name}`}
                                  >
                                      <div
                                          style={{
                                              backgroundColor:
                                                  subreddit.data.primary_color ? subreddit.data.primary_color : randomColor,
                                              display: "inline-block",
                                              color:   subreddit.data.primary_color ? getContrastColor(
                                                  subreddit.data.primary_color) : getContrastColor(randomColor),
                                              borderRadius: "5px",
                                              padding: "0.3rem",
                                              margin: "0.5rem",
                                              fontSize: "0.9rem",
                                          }}
                                          onClick={() =>
                                              setSelectedSub(
                                                  subreddit.data.display_name
                                              )
                                          }
                                      >
                                          {subreddit.data.display_name}
                                      </div>
                                  </Link>)
                            }
                              )
                            : ""}
                    </p>
                </div>
            </div>
        </div>
    );
}


import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import { selectTheme } from "../../../store/store";
import { useSelector } from "react-redux";
import { getContrastColor } from "../../../functions/getContrastColor";
import SubscribreBtn from "../../subscribeBtn/SubscribeBtn";

import "./infoBox.css"





export default function InfoSection({ selectedSubData, isLoggedIn }) {
  
 
  
  
  const theme = useSelector(selectTheme)
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
        style={{color: theme === "dark" ? "white" : "gray"}}
        >
          {isLoggedIn ? <SubscribreBtn selectedSubData={selectedSubData}/> : null}
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
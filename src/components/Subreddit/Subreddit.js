import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RedditLogo from "../../images/RedditLogo.png";
import ListOfSubsPosts from "./ListOfSubPosts";
import SubOptionSelector from "./SubOptionSelector";
import InfoSection from "./InfoSection";
import "./Subreddit.css";


export default function Subreddit({ setSelectedSub }) {

const [subTextInput, setSubTextInput] = useState();
const [selectedSubPosts, setSelectedSubPosts] = useState([]);
const [selectedSubData, setSelectedSubData] = useState({ data: {} });
const [selectedSubOption, setSelectedSubOption] = useState("hot");
 
// retreive subredditName from url bar
 const pathname = window.location.pathname;
 const parts = pathname.split('/');
 const subredditName = parts[2];


  useEffect(() => {
    async function getPopularPostsPerSub() {
      const response = await fetch(
        `https://www.reddit.com/r/${subredditName}/${selectedSubOption}.json`
      );
      const data = await response.json();
      if(data.data.children){
        setSelectedSubPosts(data.data.children);
      }

    }
    async function getSubredditData() {
      const response = await fetch(
        `https://www.reddit.com/r/${subredditName}/about.json?flair_enabled=true`
      );
      const data = await response.json();
      setSelectedSubData(data);
      
    }

    getPopularPostsPerSub();
    getSubredditData();
  
  }, [subredditName,selectedSubOption]);

  const handleChange = (e) => {
    setSubTextInput(e.target.value);
  };
  const onClick = () => {
    setSelectedSub(subTextInput);
  };

 

  // extract variables from subredditData
  const headerBannerURL = selectedSubData.data.banner_img;
  const headerImgURL = selectedSubData.data.header_img;
  const primaryColor = selectedSubData.data.primary_color
    ? selectedSubData.data.primary_color
    : "#063970";
  const iconImg = selectedSubData.data.icon_img
  ? selectedSubData.data.icon_img
  : RedditLogo;
const headerTitle = selectedSubData.data.title;
  
  return (
    <div>
      <header style={{ backgroundColor: primaryColor, minHeight: "10vh" }}>
        {selectedSubData ? (
          <>
            <img
              className="banner-bg"
              style={{
                maxWidth: "100%",
                maxHeight: "25vh",
                display: "block",
                margin: "auto",
              }}
              src={headerBannerURL ? headerBannerURL : headerImgURL}
            />
           
          </>
        ) : (
          <div>Loading...</div>
        )}
      
      </header>

      <main>
        <InfoSection selectedSubData={selectedSubData} setSelectedSub={setSelectedSub}/>
        
        <div className="post-section">
        <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={iconImg}
              alt="sub-icon-img"
              style={{ width: "100px", margin: "0 2rem" ,borderRadius:"50%",border:"4px solid white"}}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <h1>{headerTitle}</h1>
              <p>{`r/${subredditName}`}</p>
            </div>
          </div>
        <SubOptionSelector selectedSubOption={selectedSubOption} setSelectedSubOption= {setSelectedSubOption}/>
        <ListOfSubsPosts selectedSubPosts={selectedSubPosts} selectedSubData={selectedSubData} /></div>
      </main>
    </div>
  );
}


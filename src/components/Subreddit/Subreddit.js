import { useState, useEffect } from "react";
import RedditLogo from "../../images/RedditLogo.png";
import ListOfSubsPosts from "./listOfSubPosts/ListOfSubPosts";
import OptionSelector from "../optionSelector/OptionSelector";
import InfoBox from "./infoBox/InfoBox";
import SubListBox from "../subListBox/SubListBox";
import { selectUserFavSubs } from "../../app/store";
import { useSelector } from "react-redux";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import "./Subreddit.css";


export default function Subreddit({ setSelectedSub }) {

const [selectedSubPosts, setSelectedSubPosts] = useState([]);
const [selectedSubData, setSelectedSubData] = useState({ data: {} });
const [selectedSubOption, setSelectedSubOption] = useState("hot");
const favoriteSubs = useSelector(selectUserFavSubs);

// retreive subredditName from url bar
 const pathname = window.location.pathname;
 const parts = pathname.split('/');
 const subredditName = parts[2];

 useEffect(() => {
  window.scrollTo(0, 0);
}, [subredditName]);


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
      console.log(data)
      setSelectedSubData(data);
    }

    getPopularPostsPerSub();
    getSubredditData();
  
  }, [subredditName,selectedSubOption]);



 

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
      <header >
        <div style={{ backgroundColor: primaryColor, minHeight: "10vh" }}>
        
          
            <img
              className="banner-bg"
              src={headerBannerURL ? headerBannerURL : headerImgURL}
              alt="banner-img"
            />
           
          
      
        </div>
        <div
            className="title-div"
            style={{margin: "1rem 0 1rem 0"}}
          >
            <img
              src={iconImg}
              alt="sub-icon-img"
              id="sub-icon-img"
            />
            <div
              className="title-div-col"
            >
              <h1>{headerTitle}</h1>
              <p>{`r/${subredditName}`}</p>
              <p className="sub-description-mobile"><ReactMarkdown>{selectedSubData.data.public_description}</ReactMarkdown></p>
            </div>
          </div>
      </header>
      
      <main>
        
        <div className="info-section">
        <InfoBox selectedSubData={selectedSubData} setSelectedSub={setSelectedSub}/>
        <SubListBox  subRedditsList={favoriteSubs} setSelectedSub={setSelectedSub}
          boxTitle={"Favorite Subreddits"}/>
        </div>
        <div className="post-section" >
        <OptionSelector selectedSubOption={selectedSubOption} setSelectedSubOption= {setSelectedSubOption} 
          optionsObject = {{option1: "hot", option2:"new",option3:"rising"}}/>
        <ListOfSubsPosts selectedSubPosts={selectedSubPosts} selectedSubData={selectedSubData} /></div>
      </main>
    </div>
  );
}


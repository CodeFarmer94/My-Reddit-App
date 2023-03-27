import React, { useState, useEffect } from "react";
import Subreddit from "../Subreddit/Subreddit";
import PopularSubs from "../popularSubs/PopularSubs";
import SearchPostsBar from "../searchPostsBar/SearchPostsBar";
import Post from "../post/Post";
import { Switch, Route } from "react-router-dom";
import SearchResults from "../searchResults/SearchResults";
import { useSelector, useDispatch } from "react-redux";
import { selectUserFavSubs,setUserData, selectUserData, setUserFavSubs } from "../../app/store.js"



// -------  Reddit Api Settings Param
const REDDIT_CLIENT_ID = "E8YjmRNAhz4lJY9ARSsC5A";
const REDDIT_CLIENT_SECRET = "PhtmMSoqIyXE1O3a5Y5uOvEqcWB6_g";
const REDDIT_REDIRECT_URI = "http://localhost:3000/"; 
// --------


function Reddit() {

const dispatch = useDispatch();

const userData = useSelector(selectUserData);

  //State Setting
 
 
  const [selectedSub, setSelectedSub] = useState("Italy")
  const [searchTerm, setSearchTerm] = useState("")
  const [postSearchResults, setPostSearchResults] = useState([])
  const redditAccessToken = localStorage.getItem("reddit_access_token");

  function authorize() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=state&redirect_uri=${encodeURIComponent(REDDIT_REDIRECT_URI)}&duration=temporary&scope=read,identity,history,mysubreddits`;
    // Redirect the user to the authorization URL
    console.log(localStorage.getItem("reddit_access_token"))
    if(!code )
    { window.location.href = authUrl}
  }

  async function getToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const tokenUrl = "https://www.reddit.com/api/v1/access_token";
    const basicAuth = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`);
    const options = {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDDIT_REDIRECT_URI}`,
    };
    const response = await fetch(tokenUrl, options);
    const data = await response.json();
    localStorage.setItem("reddit_access_token", data.access_token);
    window.history.replaceState({}, "", window.location.pathname);
  }
  // Token retreiving 


useEffect(() => {

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if (!code && !redditAccessToken) {
    authorize();
    return;
  }
  if (!localStorage.getItem("reddit_access_token")) {
    getToken();
  }
}, [redditAccessToken, dispatch]);

useEffect(() => {
  async function getUserData() {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "Reddit_App",
        Authorization: `bearer ${redditAccessToken}`,
      },
    };
    const response = await fetch("https://oauth.reddit.com/api/v1/me.json", options);
    const data = await response.json();
    console.log(data)
    dispatch(setUserData(data));
  }

  // if access token exist run the function
  if (localStorage.getItem("reddit_access_token")) {
    getUserData();
  }
}, [redditAccessToken, dispatch]);


useEffect(() => {
  async function getUserFavSubs() {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "Reddit_App",
        Authorization: `bearer ${redditAccessToken}`,
      },
    };
    const response = await fetch( "https://oauth.reddit.com/subreddits/mine/subscriber", options);
    const data = await response.json();
    dispatch(setUserFavSubs(data.data.children));
    console.log(data.data.children)
  }
  if (redditAccessToken) {
    getUserFavSubs();
  }
}, [redditAccessToken, dispatch]);


    
// Get list of post per search
    useEffect(()=> {async function getPostsBySearchTerm(searchTerm) {
    try {

        const response = await fetch(
          `https://www.reddit.com/search.json?q=${searchTerm}&sort=popular`
        );
        const data = await response.json();
        setPostSearchResults( data.data.children.map((post) => post.data))
    } catch (error) {
        console.error(error);
        return [];
      }
    }
      getPostsBySearchTerm(searchTerm)
    },[searchTerm])




  
   
   
   
   
  return (

    <div>
      <SearchPostsBar
          setSearchTerm= {setSearchTerm} 
          setPostSearchResults={setPostSearchResults}
          userData={userData}
          />
          
      <Switch>
      <Route path="/r/:selectedSub" >
        <Subreddit selectedSub={selectedSub} setSelectedSub={setSelectedSub} />
      </Route>

      <Route path="/searchResults">
      <SearchResults searchTerm={searchTerm} postSearchResults={postSearchResults}/>
      </Route>

      <Route path="/popularSubs">
        <PopularSubs  setSelectedSub={setSelectedSub}/>
      </Route>

      <Route path="/posts/:id">
      <Post selectedSub={selectedSub} />
      </Route>

      </Switch>
      
    </div>
  );
}

export default Reddit;
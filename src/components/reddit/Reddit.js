import React, { useState, useEffect } from "react";
import Subreddit from "../Subreddit/Subreddit.js";
import Home from "../home/Home.js";
import NavBar from "../NavBar/NavBar.js";
import Post from "../post/Post";
import DropdownMenu from "../dropdownMenu/DropdownMenu.js";
import { Routes, Route } from "react-router-dom";
import SearchResults from "../searchResults/SearchResults";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserData,
  selectUserData,
  setUserFavSubs,
} from "../../store/store.js";

// -------  Reddit Api Settings Param
const REDDIT_CLIENT_ID = "E8YjmRNAhz4lJY9ARSsC5A";
const REDDIT_CLIENT_SECRET = "PhtmMSoqIyXE1O3a5Y5uOvEqcWB6_g";
const REDDIT_REDIRECT_URI = "https://trendtalk.netlify.app";
// --------

export default function Reddit() {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);

  //State Setting
  const [selectedSub, setSelectedSub] = useState("Italy");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  // Get Access token using the authorization Code
  async function getToken() {
    try {
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
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("reddit_access_token", data.access_token);
        setAccessToken(data.access_token);
      }
      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error(error);
      
    }
  }
  
 
  function authorize() {
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=state&redirect_uri=${encodeURIComponent(
      REDDIT_REDIRECT_URI
    )}&duration=temporary&scope=read,identity,history,mysubreddits,subscribe`;
      window.location.href = authUrl;
    }

  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getToken();
    }
  
  }, []);

  // Get UserData
  useEffect(() => {
    async function getUserData() {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${sessionStorage.getItem(
            "reddit_access_token"
          )}`,
        },
      };
      const response = await fetch(
        "https://oauth.reddit.com/api/v1/me.json",
        options
      );
      const data = await response.json();
      dispatch(setUserData(data));
    }
    // if access token exist run the function
    if (sessionStorage.getItem("reddit_access_token")) {
      getUserData();
    }
  }, [dispatch, accessToken]);

  // Get user subscribded subreddits
  useEffect(() => {
    async function getUserFavSubs() {
      
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${sessionStorage.getItem(
            "reddit_access_token"
          )}`,
        },
      };
      const response = await fetch(
        "https://oauth.reddit.com/subreddits/mine/subscriber",
        options
      );
      const data = await response.json();

      dispatch(setUserFavSubs(data.data.children));
    }
    if (localStorage.getItem("reddit_access_token")) {
      getUserFavSubs();
    }
  }, [dispatch, accessToken]);

  // Get list of subreddit per search

  useEffect(()=>{
      if(sessionStorage.getItem("reddit_access_token")){
        setIsLoggedIn(true)
      }
  },[isLoggedIn,accessToken])

  return (
    <div>
      <NavBar
        setSearchTerm={setSearchTerm}
        userData={userData}
        setIsDropdownVisible={setIsDropdownVisible}
        isDropdownVisible={isDropdownVisible}
        authorize={authorize}
        isLoggedIn={isLoggedIn}
      />
      <DropdownMenu
        setSearchTerm={setSearchTerm}
        setSelectedSub={setSelectedSub}
        setIsDropdownVisible={setIsDropdownVisible}
        isDropdownVisible={isDropdownVisible}
        userData={userData}
      />
      <Routes>
        <Route
          path="/:subreddit/post/:id"
          element={<Post selectedSub={selectedSub} />}
        />

        <Route
          path="/r/:subredditName"
          element={
            <Subreddit
              selectedSub={selectedSub}
              setSelectedSub={setSelectedSub}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/searchResults/:option/:searchTerm/*"
          element={<SearchResults searchTerm={searchTerm} />}
        />
        <Route
          path="/"
          element={
            <Home setSelectedSub={setSelectedSub} accessToken={accessToken} />
          }
        />
      </Routes>
    </div>
  );
}

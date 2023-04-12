import React, { useState, useEffect } from "react";
import Subreddit from "../Subreddit/Subreddit.js";
import Home from "../home/Home.js";
import SearchPostsBar from "../searchPostsBar/SearchPostsBar";
import Post from "../post/Post";
import DropdownMenu from "../dropdownMenu/DropdownMenu.js";
import { Routes, Route } from "react-router-dom";
import SearchResults from "../searchResults/SearchResults";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserData,
  selectUserData,
  setUserFavSubs,
} from "../../app/store.js";

// -------  Reddit Api Settings Param
const REDDIT_CLIENT_ID = "E8YjmRNAhz4lJY9ARSsC5A";
const REDDIT_CLIENT_SECRET = "PhtmMSoqIyXE1O3a5Y5uOvEqcWB6_g";
const REDDIT_REDIRECT_URI = "http://trendtalk.netlify.app";
// --------

export default function Reddit() {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);

  //State Setting
  const [selectedSub, setSelectedSub] = useState("Italy");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);


  // Redirect the user to the authorization URL if code is not present in URL
  function authorize() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=state&redirect_uri=${encodeURIComponent(
      REDDIT_REDIRECT_URI
    )}&duration=temporary&scope=read,identity,history,mysubreddits,subscribe`;
    
    if (!code || !localStorage.getItem("reddit_access_token")) {
      window.location.href = authUrl;
    }
  }
// Get Access token using the authorization Code
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
    setAccessToken(data.access_token);
    window.history.replaceState({}, "", window.location.pathname);
  }
  // Token retreiving

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (!code && !localStorage.getItem("reddit_access_token")) {
      authorize();
      return;
    }
    if (code) {
      getToken();
    }
    return () => {
      localStorage.removeItem("reddit_access_token");
    };
  }, []);

  // Get UserData
  useEffect(() => {
    async function getUserData() {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${localStorage.getItem(
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
    if (localStorage.getItem("reddit_access_token")) {
      getUserData();
    }
  }, [dispatch,accessToken]);

  // Get user subscribded subreddits
  useEffect(() => {
    async function getUserFavSubs() {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${localStorage.getItem(
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

  return (
    <div>
      <SearchPostsBar
        setSearchTerm={setSearchTerm}
        userData={userData}
        setIsDropdownVisible={setIsDropdownVisible}
        isDropdownVisible={isDropdownVisible}
      />
      <DropdownMenu
        setSearchTerm={setSearchTerm}
        setSelectedSub={setSelectedSub}
        setIsDropdownVisible={setIsDropdownVisible}
        isDropdownVisible={isDropdownVisible}
        userData={userData}
      />
      <Routes>
        <Route path="/:subreddit/post/:id" element={<Post selectedSub={selectedSub} />} />

        <Route path="/r/:subredditName" element={<Subreddit selectedSub={selectedSub} setSelectedSub={setSelectedSub} />} />

        <Route path="/searchResults/:option/:searchTerm/*" element={<SearchResults searchTerm={searchTerm} />} />


        <Route path="/" element={<Home setSelectedSub={setSelectedSub} accessToken={accessToken} />} />
      </Routes>
    </div>
  );
}


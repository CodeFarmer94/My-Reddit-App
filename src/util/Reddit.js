import React, { useState, useEffect } from "react";

const REDDIT_CLIENT_ID = "E8YjmRNAhz4lJY9ARSsC5A";
const REDDIT_CLIENT_SECRET = "PhtmMSoqIyXE1O3a5Y5uOvEqcWB6_g";
const REDDIT_REDIRECT_URI = "http://localhost:3000/"; 

function Reddit() {
  

  const [accessToken, setAccessToken] = useState(null)
  
  function authorize() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=state&redirect_uri=${encodeURIComponent(REDDIT_REDIRECT_URI)}&duration=temporary&scope=read`;
    // Redirect the user to the authorization URL
    if(!code)
   { window.location.href = authUrl}
  }


  async function getToken() {
    // Construct the token request URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const tokenUrl = "https://www.reddit.com/api/v1/access_token";
    const basicAuth = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)
    const options = {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDDIT_REDIRECT_URI}`
    };
    // Request the access token
    const response = await fetch(tokenUrl, options);
    const data = await response.json();
    // Save the access token to local storage
    localStorage.setItem("reddit_access_token", data.access_token);
    setAccessToken(data.access_token)
    // Clear the URL search params so it doesn't show the access token or code
    window.history.replaceState({}, "", window.location.pathname);
  }
    
    useEffect(()=>{
      console.log("effect ran")
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if(!code)
      {authorize()
      }
      getToken()
    }
    ,[])

  

  return (
    <div>
     <button onClick = {authorize}>Autorizhe</button>
     <button onClick = {getToken}> Get Token</button>
     Storage:{localStorage.getItem("reddit_access_token")}
     State:{accessToken}
    </div>
  );
}

export default Reddit;
import { useState, useEffect } from "react";
import SearchResultsSubreddits from "./SearchResultsSubreddits";
import SearchResultsPost from "./SearchResultsPost";
import SearchOptionSelector from "./SearchOptionSelector";
import "./searchResults.css";
import { useCallback } from "react";

export default function SearchResults() {
  
  const [subredditSearchResults, setSubredditSearchResults] = useState([]);
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [selectedSearchOption, setSelectedSearchOption] = useState("posts");
  const pathname = window.location.pathname;
  const parts = pathname.split("/");
  const search = parts[3];

 
  const getPostsBySearchTerm = useCallback(async ()=>{
    try {
      const response = await fetch(
        `https://www.reddit.com/search.json?q=${search}&sort=popular`
      );
      const data = await response.json();
      console.log(data)
      setPostSearchResults(data.data.children.map((post) => post.data));
      
    } catch (error) {
      console.error(error);
      return [];
    }
  },[search])

  const getSubredditsBySearchTerm = useCallback(async()=> {
    try {
      const response = await fetch(
        `https://www.reddit.com/subreddits/search.json?q=${search}&sort=popular`
      );
      const data = await response.json();

      setSubredditSearchResults(
        data.data.children.map((subreddit) => subreddit.data)
      );
     
    } catch (error) {
      console.error(error);
      return [];
    }
  },[search])
  
  useEffect(() => {
    console.log("search effect run")
    getPostsBySearchTerm();
    getSubredditsBySearchTerm();
  }, [getPostsBySearchTerm,getSubredditsBySearchTerm]);

  return (
    <div className="searchResults-section">
      <SearchOptionSelector
        selectedSearchOption={selectedSearchOption}
        setSelectedSearchOption={setSelectedSearchOption}
      />
      {selectedSearchOption === "posts" && (<SearchResultsPost postSearchResults={postSearchResults} />)}
      {selectedSearchOption === "subreddits" && (<SearchResultsSubreddits subredditSearchResults={subredditSearchResults} />)}
    </div>
  );
}

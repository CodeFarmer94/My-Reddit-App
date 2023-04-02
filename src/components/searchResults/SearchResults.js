import { useState, useEffect } from "react";
import { Switch,Route } from "react-router-dom";
import SearchResults_Subreddits from "./SearchResults_Subreddits";
import SearchResults_Post from "./SearchResults_Post";
import SearchOptionSelector from "./SearchOptionSelector";
import "./searchResults.css"


export default function SearchResults() {
  const [subredditSearchResults, setSubredditSearchResults] = useState([]);
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [selectedSearchOption, setSelectedSearchOption] = useState("posts");

  const pathname = window.location.pathname;
  const parts = pathname.split('/');
  const search = parts[3];

  useEffect(() => {
    async function getPostsBySearchTerm() {
      try {
        const response = await fetch(
          `https://www.reddit.com/search.json?q=${search}&sort=popular`
        );
        const data = await response.json();
        setPostSearchResults(
          data.data.children.map((post) => post.data)
          )
          console.log(postSearchResults)
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    getPostsBySearchTerm();
  }, [search,selectedSearchOption]);

  useEffect(() => {
    async function getSubredditsBySearchTerm() {
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
    }
    getSubredditsBySearchTerm();
  }, [search,selectedSearchOption]);



  return (
    <div>
     <main className="searchResults-grid">
        <div className="searchResults-section">
      <SearchOptionSelector
        selectedSearchOption={selectedSearchOption}
        setSelectedSearchOption={setSelectedSearchOption}
        
      />
      <Switch>
        <Route to={`/searchResults/posts/:searchTerm`} exact>
        {selectedSearchOption === "posts" && (
        <SearchResults_Post postSearchResults={postSearchResults}  />
      )}
      </Route>
      <Route to="/searchResults/subreddits/:searchTerm" exact>
      {selectedSearchOption === "subreddits" && (
        <SearchResults_Subreddits
          subredditSearchResults={subredditSearchResults} 
        />
      )}
      </Route>
      </Switch>
      
      </div>
    </main>
    </div>
  );
}

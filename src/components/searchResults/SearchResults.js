import { useState, useEffect } from "react";
import SearchResults_Subreddits from "./SearchResults_Subreddits";
import SearchResults_Post from "./SearchResults_Post";
import SearchOptionSelector from "./SearchOptionSelector";
import "./searchResults.css"


export default function SearchResults({ searchTerm }) {
  const [subredditSearchResults, setSubredditSearchResults] = useState([]);
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [selectedSearchOption, setSelectedSearchOption] = useState("posts");

  useEffect(() => {
    async function getPostsBySearchTerm(searchTerm) {
      try {
        const response = await fetch(
          `https://www.reddit.com/search.json?q=${searchTerm}&sort=popular`
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
    getPostsBySearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    async function getSubredditsBySearchTerm(searchTerm) {
      try {
        const response = await fetch(
          `https://www.reddit.com/subreddits/search.json?q=${searchTerm}&sort=popular`
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
    getSubredditsBySearchTerm(searchTerm);
  }, [searchTerm]);



  return (
    <div>
     <main className="searchResults-grid">
        <div className="searchResults-section">
      <SearchOptionSelector
        selectedSearchOption={selectedSearchOption}
        setSelectedSearchOption={setSelectedSearchOption}
      />
      {selectedSearchOption === "posts" && (
        <SearchResults_Post postSearchResults={postSearchResults} searchTerm={searchTerm} />
      )}
      {selectedSearchOption === "subreddits" && (
        <SearchResults_Subreddits
          subredditSearchResults={subredditSearchResults} searchTerm={searchTerm}
        />
      )}</div>
    </main>
    </div>
  );
}

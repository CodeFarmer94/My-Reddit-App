import { useSelector } from "react-redux";
import { selectUserFavSubs } from "../../app/store";
import { useState } from "react";
import { Link } from "react-router-dom";
import RedditLogo from "../../images/RedditLogo.png";
import { FaUserNinja } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import "./dropdownMenu.css"

export default function DropdownMenu({ setSearchTerm,isDropdownVisible,setIsDropdownVisible,userData,setSelectedSub }){

   
    const favoriteSubs = useSelector(selectUserFavSubs);
    const [searchInputText, setSearchInputText] = useState("")
    const [isFavSubDropdownVisible, setIsFavSubDropdownVisible] = useState(false)

    // Handle toggling the main dropdown visibility
    const handleDropdown = () => {
        setIsDropdownVisible(prevState=> !prevState)
    }
    
    // Handle toggling the favorite subs dropdown visibility
    const handleFavSubDropdown = () => {
        setIsFavSubDropdownVisible(prevState=> !prevState)
    }

    // Handle updating the search input text
    const handleChange = (e) => {
        setSearchInputText(e.target.value)
    }
    
    // Handle searching Reddit
    const searchReddit = () => {
        setSearchTerm(searchInputText)
        handleDropdown()
        // Redirect the user to the search results page
        window.location.href = `/searchResults/posts/${searchInputText}`;
    }
    
    // Handle pressing enter in the search input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchReddit();
        }
    }
    
    // Map the user's favorite subreddits to a list of Links
    const favoriteSubsList = favoriteSubs.map( subreddit => {
        return(<Link
            key={subreddit.data.id}
            to={`/r/${subreddit.data.display_name}`} 
            onClick={() => {
                handleDropdown()
                setSelectedSub(subreddit.data.display_name)}}
          ><div className="flex-row dropdown-sub-element white" >
        <img
          
          src={
            subreddit.data.icon_img
              ? subreddit.data.icon_img
              : RedditLogo
          }
          alt="subreddit-icon"
        />
          <div className="text-left">
          <strong>{subreddit.data.display_name_prefixed}</strong></div></div>
          </Link>
          )})
    
    return (

        <div className={isDropdownVisible ? "display-block" : "display-none"}>
            <div className="dropdown-menu light-theme-color flex-col">
            <input type= "text" onChange={handleChange} placeholder="Search Reddit..." onKeyDown = {handleKeyDown}/>
            <div className="dropwdown-section flex-row">
            <div className="user-stats-mobile">
            <p className="text-left flex-row"><FaUserNinja/>{userData.name}</p>
            </div>  
            </div>
            <p onClick={handleFavSubDropdown} className="text-left flex-row"><FaHeart/>Favorite Subs</p>
            <div className={isFavSubDropdownVisible ? "display-block" : "display-none"}>{favoriteSubsList}</div>
            </div>  
            </div>
        
    )
}
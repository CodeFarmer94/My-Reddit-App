
import { selectUserFavSubs } from "../../store/store";
import { useState } from "react";
import { Link } from "react-router-dom";
import RedditLogo from "../../images/RedditLogo.png";
import { FaUserNinja } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/store";
import { toggleTheme } from "../../store/store";
import { useDispatch } from "react-redux";
import "./dropdownMenu.css"

export default function DropdownMenu({ setSearchTerm,isDropdownVisible,setIsDropdownVisible,userData,setSelectedSub }){

    const dispatch = useDispatch()
    const theme = useSelector(selectTheme)
    const favoriteSubs = useSelector(selectUserFavSubs);
    const [searchInputText, setSearchInputText] = useState("")
    const [isFavSubDropdownVisible, setIsFavSubDropdownVisible] = useState(false)

      // Dispatch theme change to store
     const setTheme = () => {
    if (theme === "dark") {
      dispatch(toggleTheme("light"));
    } else {
      dispatch(toggleTheme("dark"));
    }
  };
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
            <section className="nav-section flex-row">
        <p>{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
        <div class="toggle-slide">
          <input
            type="checkbox"
            id="toggle"
            checked={theme === "dark" ? true : false}
            onClick={setTheme}
          />
          <label for="toggle" class="toggle-icon"></label>
        </div>
      </section>
            <p onClick={handleFavSubDropdown} className="text-left flex-row"><FaHeart/>Favorite Subs
            {isFavSubDropdownVisible ? <FaAngleDown/> : <FaAngleRight/>}
            </p>
            <div className={isFavSubDropdownVisible ? "display-block" : "display-none"}>{favoriteSubsList}</div>
            </div>  
            </div>
        
    )
}
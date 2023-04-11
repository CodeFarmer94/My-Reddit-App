import "./searchPostsBar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import TrenkTalkLogo from "../../images/TrenkTalkLogo.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../app/store";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../app/store";
export default function SearchPostsBar({
  setSearchTerm,
  userData,
  setIsDropdownVisible,
 
}) {

  //  Local search Input value state
  const [searchInputText, setSearchInputText] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  // Dispatch theme change to store
  const setTheme = () => {
    if (theme === "dark") {
      dispatch(toggleTheme("light"));
    } else {
      dispatch(toggleTheme("dark"));
    }
  };
  // Toggle down Mobile Menu
  const handleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };
  // Control input by React
  const handleChange = (e) => {
    setSearchInputText(e.target.value);
  };
  // Change parent state and redirect user to search page
  const searchReddit = () => {
    setSearchTerm(searchInputText);
    window.location.href = `/searchResults/posts/${searchInputText}`;
  };
  // Key down event listener 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchReddit();
    }
  };
  return (
    <nav className="light-theme-color">
      <Link to="/">
        <img alt="website logo" src={TrenkTalkLogo} />
      </Link>
      <section className="nav-section">
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search Reddit..."
        />
      </section>
      <section className="nav-section">
        <img src={userData.icon_img} alt="user icon" id="user-icon" />
        <div className="user-stats">
          <p>{userData.name}</p>
          <p className="karma">{userData.total_karma} karma</p>
        </div>
      </section>
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
      <div className="mobile-options" onClick={handleDropdown}>
        <span>
          <FaBars />
        </span>
      </div>
    </nav>
  );
}

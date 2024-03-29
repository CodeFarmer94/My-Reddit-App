import "./NavBar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import TrenkTalkLogo from "../../images/TrenkTalkLogo.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/store";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../store/store";
export default function NavBar({
  setSearchTerm,
  userData,
  setIsDropdownVisible,
  authorize,
  isLoggedIn
 
}) {

  //  Local search Input value state
  const [searchInputText, setSearchInputText] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  // Dispatch theme change to store
  const setTheme = () => {
    if (theme === "dark") {
      dispatch(toggleTheme("light"));
      localStorage.setItem("theme", "light")
    } else {
      localStorage.setItem("theme", "dark")
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
  const handleClick = () => {
    if(!isLoggedIn){
      authorize()
    }
  }
  return (
    <nav className="light-theme-color">
      <Link to="/">
        <img alt="website logo" src={TrenkTalkLogo} id="website-logo"/>
      </Link>
      <section className="nav-section">
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search Reddit..."
        />
      </section>
      <section className="nav-section flex-row no-mobile">
        <p>{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
        <div className="toggle-slide">
          <input
            type="checkbox"
            id="toggle"
            defaultChecked={theme === "dark" ? true : false}
            onClick={setTheme}
          />
          <label htmlFor="toggle" className="toggle-icon"></label>
        </div>
      </section>
      <section className={isLoggedIn ? "nav-section" : "nav-section display-none"}>
        <img src={userData.icon_img} alt="user icon" id="user-icon" />
        <div className="user-stats">
          <p>{userData.name}</p>
          <p className="karma">{userData.total_karma} karma</p>
        </div>
      </section>
      <button className="login-btn" onClick ={ ()=> handleClick()}>{isLoggedIn ? "You are Logged" : "Login"}</button>
      <div className="mobile-options" onClick={handleDropdown}>
        <span>
          <FaBars />
        </span>
      </div>
    </nav>
  );
}

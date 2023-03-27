import "./searchPostsBar.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import TrenkTalkLogo from '../../images/TrenkTalkLogo.png';
export default function SearchPostsBar({setSearchTerm, userData}){

    const [searchInputText, setSearchInputText] = useState("")

    const handleChange = (e) => {
        setSearchInputText(e.target.value)
        console.log()
    }
    const onClick = () => {
        setSearchTerm(searchInputText)
    }
        
return (
    <navbar>
     <Link to= '/'><img alt="website logo"src={TrenkTalkLogo}/></Link> 
      <section className="search">
      <input type= "text" onChange={handleChange} placeholder="Search Reddit..."/>
       <Link to="/searchResults"><button onClick = {onClick}>Search Posts</button></Link>
      </section>
   
      <section className="profile">
      <img src={userData.icon_img} alt="user icon"/>
      <div className="user-stats">
      <p>{userData.name}</p>
      <p>{userData.total_karma} karma</p>
      </div>
      </section>
      </navbar> 
    )
}
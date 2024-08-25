import { useState } from "react";
import style from "../styles/navigationTop.module.css"
import search from "../images/search.svg"
import emptyUser from "../images/emptyUser.svg";
import collection from "../images/collection.svg"
import { useDispatch } from "react-redux"
import { searchPosts } from "../feature/post/postSlice";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function TopNav(props){
    const [query, setQuery] = useState('');
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    function searchDB(e){
        if(e.key === 'Enter' || e.which === 13){
            // dispatch(searchPosts({query: query}));
            const queryString = "?q=" + query
            const searchParam = new URLSearchParams(queryString);
            navigate('/search' + queryString, {state:{postSearch:true, placeSearch: false}})
           }     
    }
    return( 
        <div className = {style.contentWrapper}>
            <div className = {style.content}>
                <div className = {style.profileImageWrapper}>
                    <img className = {style.profileImage} referrerPolicy="no-referrer" src={props.userInfo !== null ? props.userInfo.profilePictureURL : emptyUser} alt=""/>
                </div>

                <div className={style.searchBarWrapper}>
                    <div className = {style.searchButton}>
                        <img className = {style.searchIcon} src = {search}/>
                    </div>
                    <input type="search" value={query} placeholder="搜索 #标签 或关键词" className={style.searchBar} onChange={(e)=>setQuery(e.target.value)} onKeyPress={(e)=>searchDB(e)}/>
                </div>
                <NavLink to="/collection" className = {style.starArchor}>
                    <div className={style.starWrapper}>
                        <img src={collection} className={style.star}/>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}
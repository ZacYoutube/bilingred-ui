import style from "../styles/navigationBot.module.css"
import location from "../images/location.svg"
import plus from "../images/plus.svg"
import home from "../images/home.svg" 
import { NavLink } from "react-router-dom"
import logout from "../images/logOut.svg"

export default function BottomNav(){

    return(
        <div className={style.contentWrapper}>
            <div className = {style.content}>
            <NavLink to="/places"   className={({ isActive }) => (isActive ? style.active : undefined)}
>
                <div className = {style.locationWrapper}>
                    <img className = {style.location} src = {location}/>
                </div>
            </NavLink>
            <NavLink to="/publish">
                <div className = {style.publishWrapper}>
                    <img className = {style.publish} src = {plus}/>
                </div>
            </NavLink>
            <NavLink to="/home" className={({ isActive }) => (isActive ? style.active : undefined)}>
                <div className = {style.exploreWrapper}>
                    <img className = {style.explore} src = {home}/>
                </div>
            </NavLink>
            <NavLink to="/logout" className={({ isActive }) => (isActive ? style.active : undefined)}>
                <div className = {style.exploreWrapper}>
                    <img className = {style.explore} src = {logout}/>
                </div>
            </NavLink>
            </div>
        </div>
    )
}
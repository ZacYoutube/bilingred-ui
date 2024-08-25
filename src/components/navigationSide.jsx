import style from "../styles/navigationSide.module.css"
import explore from "../images/home.svg"
import plus from "../images/plus.svg"
import location from "../images/location.svg"
import collection from "../images/collectionOutlined.svg"
import emptyUser from "../images/emptyUser.svg";
import { useDispatch } from 'react-redux';
import { logOut, reset } from "../feature/auth/authSlice"
import {  useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom"
import logout from "../images/logOut.svg"
import publishStretched from "../images/publishStretched.svg"
import myPlaces from "../images/at.svg"

export default function SideNav(props){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogOut = () => {
        dispatch(logOut(props.isGoogle, false));
        dispatch(reset());
        
    }

    console.log(props)

    return(
        <div className={style.content}>
            {
                props.userInfo ? 
                <NavLink to="/profile" className={style.profileArchor}>
                <div className = {style.profileImageWrapper}>
                    <img className = {style.profileImage} referrerPolicy="no-referrer" src={props.userInfo !== null ? props.userInfo.profilePictureURL.length > 0 ? props.userInfo.profilePictureURL : 'https://thumbs.dreamstime.com/b/no-user-profile-picture-hand-drawn-illustration-53840792.jpg' : emptyUser} alt=""/>
                </div>
                </NavLink> :
                <NavLink to="/" className={style.profileArchor}>
                <div className = {style.profileImageWrapper} onClick={()=>{navigate('/')}}>
                    <img className = {style.profileImage} referrerPolicy="no-referrer" src={props.userInfo !== null ? props.userInfo.profilePictureURL : emptyUser} alt=""/>
                </div>
                </NavLink>

            }
            <NavLink to="/home" className={({ isActive }) => (isActive ? style.active : style.inactive)}>
            <div className={style.commonMenuItems}>
                <img src={explore} className={style.explore}/>
                <div className={style.menuItemText}>主页</div>
            </div>
            </NavLink>
            <NavLink to="/places" className={({ isActive }) => (isActive ? style.active : style.inactive)}>
                <div className={style.commonMenuItems}>
                    <img src={location} className={style.location}/>
                    <div className={style.menuItemText}>周边</div>
                </div>
            </NavLink>
            <NavLink to="/myPlaces" className={({ isActive }) => (isActive ? style.active : style.inactive)}>
                <div className={style.collectionItems}>
                    <img src={myPlaces} className={style.location}/>
                    <div className={style.menuItemText}>正在关注</div>
                </div>
            </NavLink>

            <NavLink to="/collection" className={({ isActive }) => (isActive ? style.active : style.inactive)}>
                <div className={style.collectionItems}>
                    <img src={collection} className={style.location}/>
                    <div className={style.menuItemText}>帖子收藏</div>
                </div>
            </NavLink>


            <NavLink to="/publish" className={style.publishArchor}>
                <div className={style.publishWrapper}>
                    <img src={plus} className={style.plus}/>
                    <img src={publishStretched} className={style.publishStretched}/>
                </div>
            </NavLink>
            {
                props.userInfo ? 
                <div onClick={onLogOut} className={style.logoutWrapper}>
                    <img src={logout} alt="" className= {style.logout}/>
                    <div className={style.menuItemText}>登出</div>
                </div>
                :
                <></>
            }
        </div>
    )
}
import React, { useEffect, useState, useRef } from "react"
import style from "../styles/post.module.css"
import star from "../images/star.svg"
import { format } from 'timeago.js';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, Link } from "react-router-dom";
import { deletePost, getMyPost, starAPost, unstarAPost, getStarredPosts } from "../feature/post/postSlice"
import { getUser } from "../feature/auth/authSlice";
import Quill from "quill";
import extractTags from "../api/extractTags";
import share from "../images/share.svg"
import edit from "../images/edit.svg"
import deleteIcon from "../images/delete.svg"
import Modal from "react-modal";
import { modalStyle } from '../api/modalSettings.js'

export default function ImagePost(props){
    const navigate = useNavigate();

    // fancy star

    const [isLighted, setIsLighted] = useState(false);
    const { user } = useSelector((state) => state.auth);
    function handleStarClick(){
        if(!isLighted){
            setIsLighted(true);
            dispatch(starAPost({user: user, postId: props._id})).then(_ => {
                dispatch(getUser({user: user, token: user.token})).then(res => {
                    if(res.payload && res.payload.favoritePostList.includes(props._id)){
                        setIsLighted(true);
                    }else
                        setIsLighted(false);
                })
                dispatch(getStarredPosts({user: user}));
            })
        }else{
            setIsLighted(false);
            dispatch(unstarAPost({user: user, postId: props._id})).then(_ => {
                dispatch(getUser({user: user, token: user.token})).then(res => {
                    if(res.payload && res.payload.favoritePostList.includes(props._id)){
                        setIsLighted(true);
                    }else
                        setIsLighted(false);
                })
                dispatch(getStarredPosts({user: user}))
            })
        }
        
        
    }

    useEffect(()=>{
        // console.log(props);
        if(user && user.favoritePostList.includes(props._id)){
            setIsLighted(true);
        }
    },[user,props])

    const [time, setTime] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [displayDeleteWindow, setDisplayDeleteWindow] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const {myPost, msg, error, successful, loading } = useSelector(
        (state) => state.post
    )
    let quillText = useRef(null);

    useEffect(()=>{
        setTime(convertGMTZone(props.createdAt))
        let tempWrapper = document.createElement("div");
        let editor = new Quill(tempWrapper)
        editor.setContents(JSON.parse(props.text))
        quillText.current.innerHTML = editor.getText();
    },[props])

    function convertGMTZone(time){
        var myDate = new Date(time)
        var pstDate = myDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }) 
        return pstDate;
    }

    function deleteClick(){
        setDisplayDeleteWindow(true);
    }

    function cancelClick(){
        setDisplayDeleteWindow(false);
    }

    function handleDeletePost(){
        const data = {
            user: user,
            post: props?.post
        }
        dispatch(deletePost(data)).then(()=>{
            if(successful){
                // console.log("BOOM!")
                setDisplayDeleteWindow(false);
                dispatch(getMyPost(props));
            }
        });
    }

    return(
        <div className = {style.contentWrapper}>
            <Modal 
                isOpen={displayDeleteWindow} 
                appElement={document.getElementById("root")}
                ariaHideApp={true}
                defaultStyles={modalStyle}
            >
            <div className={style.container}>
                <div className={style.confirmationText}>
                    确认删除帖子？
                </div>
                <div className={style.buttonContainer}>
                <button 
                    className={style.cancelButton}
                    onClick={cancelClick}
                    >
                    返回
                </button>
                <button 
                    className={style.confirmationButton}
                    onClick={handleDeletePost}
                    >
                    确认
                    </button>
                </div>
            </div>
            </Modal>
            
            <div className = {style.content}>
                <div className = {style.header}>
                    <div className = {style.profileImageWrapper}>
                        <img src = {props.profileImageUrl && props.profileImageUrl.length > 0 ? props.profileImageUrl : 'https://thumbs.dreamstime.com/b/no-user-profile-picture-hand-drawn-illustration-53840792.jpg'} referrerPolicy="no-referrer" className = {style.profileImage} alt=""/>
                    </div>
                    <div className = {style.profileNameAndTimeWrapper}>
                        <div className = {style.profileName}>
                            {props.profileName} &nbsp;&nbsp;
                        </div>
                        <div className = {style.time}>
                            {/* Yesterday */}
                            {format(time)} @ { props.at }
                        </div>
                    </div>
                    <div className={style.iconsWrapper}>
                        {
                        location.pathname.includes('profile') ? 
                        <>
                            <Link to="/publish" className={style.editArchor} state={{postData: props}} >
                                <img src={edit} className={style.edit} alt=""/> 
                            </Link>
                            <img src={deleteIcon} className={style.delete} onClick={deleteClick} alt=""/>
                        </> : 
                        null
                        }
                        <div className={style.shareWrapper}>
                            <img src={share} className={style.share} alt=""/>
                        </div>
                        <div className = {style.starWrapper} style={{display : location.pathname.includes('profile') ? 'none' : 'block'}}>
                        <div className={style.fav} onClick={user ? handleStarClick : ()=>navigate('/')}>
                            <svg className={isLighted ? style.fav_star : style.fav_star_dimmed} viewBox="0 0 114 110">
                                <path d="M48.7899002,5.95077319 L39.3051518,35.1460145 L8.60511866,35.1460145 C4.87617094,35.1519931 1.57402643,37.5554646 0.422104463,41.1020351 C-0.7298175,44.6486057 0.529798011,48.5337314 3.54354617,50.7297298 L28.3840111,68.7758317 L18.8992627,97.971073 C17.7496089,101.520283 19.0141379,105.406227 22.0323508,107.599168 C25.0505637,109.792109 29.1370771,109.794067 32.1573906,107.604021 L56.9864557,89.5693186 L81.8269206,107.615421 C84.8472342,109.805467 88.9337475,109.803509 91.9519605,107.610568 C94.9701734,105.417627 96.2347024,101.531683 95.0850486,97.9824729 L85.6003001,68.7986315 L110.440765,50.7525296 C113.466376,48.5582894 114.732852,44.663975 113.576698,41.1097771 C112.420545,37.5555791 109.105303,35.1516627 105.367793,35.1574144 L74.6677595,35.1574144 L65.1830111,5.96217312 C64.0286485,2.41064527 60.7208743,0.00457304502 56.9864557,5.53367114e-06 C53.2527571,-0.00420898295 49.9421526,2.39931752 48.7899002,5.95077319 Z"></path>
                            </svg>
                            
                            <span className={isLighted ? style.fav_round : style.hide}></span>
                            <span className={isLighted ? style.fav_sparkle : style.hide}>
                                <span className={isLighted ? style.fav_sparkle_i : style.hide}></span>
                                <span className={isLighted ? style.fav_sparkle_i : style.hide}></span>
                                <span className={isLighted ? style.fav_sparkle_i : style.hide}></span>
                                <span className={isLighted ? style.fav_sparkle_i : style.hide}></span>
                                <span className={isLighted ? style.fav_sparkle_i : style.hide}></span>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = {style.title}>
                    {
                        extractTags(props.title)?.tagsArray.map((tag)=>{
                            // console.log(extractTags(props.title))
                            return <span key = {tag} style={{color: "#4FAEF9"}}>{tag} &nbsp;</span>
                        })
                    
                    }
                    <span>{extractTags(props.title)?.title}</span>

                </div>
                <div ref={quillText} className = {style.text}>
                    {/* {props.text} */}
                </div>
                <div className = {style.displayImageWrapper}>
                    <img src = {props.image[0] || ""} className = {style.displayImage1} 
                    onLoad=
                    {
                        (evt)=>{
                            evt.target.className=`${style.displayImageAppear1}`
                        }
                    } alt=""/>

                    <img src = {props.image[1] || ""} className = {style.displayImage2} 
                    onLoad=
                    {
                        (evt)=>{
                            evt.target.className=`${style.displayImageAppear2}`
                        }
                    
                    } alt=""/>

                </div>      
            </div>
        </div>
    )

}
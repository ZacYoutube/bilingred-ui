import React, { useEffect, useState } from "react";
import ImagePost from "../components/post";
import style from "../styles/profilePageStyle.module.css"
import profileImage from "../images/cover.jpg"
import { faker } from "@faker-js/faker";
import emptyUser from "../images/emptyUser.svg";
import { getMyPost } from "../feature/post/postSlice"
import { useDispatch, useSelector } from "react-redux"
import { store } from '../app/store'
import { useLocation } from "react-router-dom";


function UserInfo(props){
    return(
        <div className={style.userInfo}>
            <div className={style.profileImageWrapper}>
                <img src={props.profileImage != null ? props.profileImage.length > 0 ? props.profileImage : 'https://thumbs.dreamstime.com/b/no-user-profile-picture-hand-drawn-illustration-53840792.jpg' : emptyUser} className={style.profileImage} alt=""/>
            </div>
            <div className={style.name}>
                {props.name}
            </div>
            <div className={style.description}>
                {props.description}
            </div>
        </div>
    )
}


export default function ProfilePage(){
    //只需要获取两周之内的帖子，可能以后换成三个星期，四个星期。
    //留一个variable来以后调整
    const { user, isLoading, isError, isSuccessful, message, isGoogle } = useSelector(
        (state) => state.auth
    )

    const { myPost, msg, error, successful, loading } = useSelector(
        (state) => state.post
    )

    const location = useLocation();
    const userState = location?.state;

    const dispatch = useDispatch();
    
    useEffect(() => {
        const data = {
            user: user || null,
        }
        if (user) {
            if (userState != undefined && userState != null) {
                dispatch(getMyPost(userState));
            }
            else {
                dispatch(getMyPost(data));
            }   
        }
    },[dispatch, user])

    const fetchWithInWeeks = 2;
    return(
        <div className={style.content}>
            <UserInfo 
                name={userState?.user?.username || user?.name}
                description={userState?.user?.bio || user?.bio || "This is empty, describe yourself...."}
                profileImage={userState?.user?.profilePictureURL || user?.profilePictureURL}
            />
            {
                myPost?.posts && myPost?.posts.map((item, idx) => {
                    const dataSample = {
                        profileName : userState?.user ? userState.user.username : user?.name,
                        profileImageUrl : userState?.user ? userState.user.profilePictureURL : user?.profilePictureURL,
                        title : item.title,
                        text : item.text,
                        image: item.image,
                        createdAt: item.createdAt,
                        at: item.at,
                        post: item,
                        user: userState?.user || user || null
                    }

                    return (
                        <ImagePost {...dataSample} key={idx}/>
                    )
                })
            }

        </div>
    )
}
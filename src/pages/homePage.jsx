import React, { Fragment, useState, useRef, useEffect } from "react";
import InfiniteScroll from "../api/InfiniteScroll.js";
import ImagePostData from "../fakeData/fakeImagePostData.js";
import ImagePost from "../components/post";
import TopNav from "../components/navigationTop.jsx";
import BottomNav from "../components/navigationBot.jsx";
import homePageStyle from "../styles/homePage.module.css"
import { faker } from '@faker-js/faker';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNav from "../components/navigationSide.jsx";
import { SignInPage, SignUpForm, SignInForm } from './signInPage'
import profileImage from "../images/profile.webp"
import { useDispatch, useSelector } from "react-redux"
import { getAllPosts, getRowCount, getCount4Spec } from "../feature/post/postSlice"
import { findUser } from "../feature/auth/authSlice"
import { render } from "react-dom";

export function ImagePosts(){

    const PostRadius = 10;
    const fetchLength = 50; //length of data fetched each time
    const renderLength = 10; //Length of data rendered each time, MUST be a factor of fetchLength
    const storedList = useRef([])
    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    const { user } = useSelector((state) => state.auth)
    // const { searchResult } = useSelector((state) => state.post)

    useEffect(()=>{
        // console.log(searchResult)
        if(user){
            dispatch(getCount4Spec({user: user})).then(res => {
                setCount(res.payload.data.count);
            })
        }
        
    },[dispatch, user
        // , searchResult
    ])

    function processData(data){
        return data.map((props) => (<ImagePost {...props}/>));
    }

    const getNextList = async function(currentLength){

        if(currentLength + renderLength > storedList.current.length){
            return new Promise((resolve, reject) =>{

                let data = {
                    page : storedList.current.length / fetchLength,
                    limit : fetchLength,
                    user: user
                }
                
                dispatch(getAllPosts(data)).then((res)=>{
                    console.log(res);
                    resolve(res.payload.data.data)
                })

            }).then((fetchedData) => {
                    storedList.current = storedList.current.concat(processData(fetchedData))
                    return storedList.current.slice(currentLength, currentLength+renderLength)
                })
        }
        //Required data is in storedList 
        else{
            // console.log("rendering UX")
            //set a timeout for UX purposes
            return new Promise((resolve, reject) =>{
                setTimeout(() =>{
                resolve(storedList.current.slice(currentLength, currentLength+renderLength))
            }, 1500)
            })

    }
}
    // console.log(total, postList)
    return(
        <InfiniteScroll getNextList={getNextList} preRenderRadius={PostRadius} rowCount={count}/>
    )
}
export function HomePage() {
    const { user } = useSelector((state) => state.auth)

    return(
        <div className = {homePageStyle.content}>
            <TopNav userInfo={user}/>
            <div className = "Posts_Positioner">
                <ImagePosts/>
            </div>
        </div>
    )
}
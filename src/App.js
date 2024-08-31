import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css"
import "./fonts/fonts.css"

import { SignInForm, SignInPage, SignUpForm } from "./pages/signInPage";
import EmailVerify from './pages/EmailVerify';
import PlaceCard from "./components/placeCard";
import PlaceExplorePage from "./pages/placeExplorePage";
import ProfilePage from "./pages/profilePage";
import CollectionPage from "./pages/collectionPage";
import FollowedPlacesPage from "./pages/followedPlacesPage";
import { HomePage } from './pages/homePage';
import SearchPage from "./pages/searchPage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import BottomNav from "./components/navigationBot";
import SideNav from "./components/navigationSide";
import PublishPage from "./pages/publishPage";
import { useSelector } from "react-redux";
import { useIdleTimer } from 'react-idle-timer'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Countdown from 'react-countdown';
import LogoutPage from "./pages/logoutPage";
import PostDetailsPage from "./pages/postDetails";

function App() {

  const [ userInfo, setUserInfo ] = useState(null);
  const { user, isGoogle } = useSelector(
      (state) => state.auth
  )

  useEffect(()=>{
      setUserInfo(user)
  },[user, userInfo])


  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = "/";
  }

  const handleOnIdle = event => {
    if(user){  
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="idle-container">
              <p className="message">Are you still there?</p>
              <div className="count-down-container">
                <Countdown
                  date={Date.now() + 900000}
                  renderer={({minutes, seconds, completed})=>{
                    if (completed) {
                      logout();
                      onClose();
                    } else {
                      // Render a countdown
                      return <span>{minutes}m:{seconds}s</span>;
                    }
                  }}
                />
              </div>
              <div className="options">
                <button 
                  className="btn"
                  onClick={()=>{
                    logout();  
                  }
                  }>
                  No, log me off.
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Yes, keep logged in.
                </button>
              </div>
            </div>
          );
        }
        });
    }
    
  }


  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
      // set how long can user stay idled before a prompt box is shown
      timeout: 1000 * 60 * 15,
      onIdle: handleOnIdle,
      debounce: 500
    })


  // console.log(getRemainingTime, getLastActiveTime)

  return(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  <Router>
    <div className = "app">
      <Routes>
        <Route element={
          <>
            <SideNav userInfo={userInfo} isGoogle={isGoogle} />
            <Outlet/>
            <BottomNav />
          </>
        }>
          <Route path="/places" element={<PlaceExplorePage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/myPlaces" element={<FollowedPlacesPage/>}/>
          <Route path="/collection" element={<CollectionPage/>}/>
          <Route path="/search" element={<SearchPage />}/>
          <Route path="/detail" element={<PostDetailsPage />}/>
          <Route path="/logout" element={<LogoutPage isGoogle={isGoogle} />} />
        </Route>

        <Route element={
          <>
            <SideNav userInfo={userInfo} isGoogle={isGoogle} />
            <Outlet/>
          </>
        }>
        <Route path="/publish" element={<PublishPage/>}/>
        </Route>

        <Route element={<Outlet/>}>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/user/:id/verify/:token" element={<EmailVerify />} />
        </Route>

      </Routes>
    </div>
  </Router>
  </GoogleOAuthProvider>

)}

export default App;
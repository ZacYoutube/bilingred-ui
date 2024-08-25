import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import style from "../styles/emailVerifyPage.module.css";
import { Checkmark } from "react-checkmark";

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const param = useParams();
    useEffect(()=>{
        const verifyEmailUrl = async() => {
            try{
                const url = `${process.env.REACT_APP_API_URL}/user/${param.id}/verify/${param.token}`
                const { data } = await axios.get(url);
                setValidUrl(true);
                setToken(data.token.token);
            }catch(err){
                setValidUrl(false);
            }
        }

        verifyEmailUrl();
    },[param]);

    async function toLogin(){
        await axios.delete(`${process.env.REACT_APP_API_URL}/token/${token}`).then(()=>{
            navigate("/signin")
        });
    }

    return(
        <div>
            {
                validUrl?(
                    <div className={style.verificationWrapper}>
                        <Checkmark />
                        <div><span>Thank you for verifying!</span></div>
                        <div><span>Now you may continue to login by clicking the button below.</span></div>
                        <button onClick={toLogin}>Login</button>
                    </div>)
                    :
                    (
                    <h1 style={{textAlign: "center"}}> 404 Not Found </h1>
                    )
            }
        </div>
    )
}

export default EmailVerify;
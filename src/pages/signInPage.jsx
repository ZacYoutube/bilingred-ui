import React, { useState, useEffect } from "react"
import style from "../styles/signInPage.module.css"
import logo from "../images/logo.svg"
import AppleLogo from "../images/AppleLogo.svg"
import GoogleLogo from "../images/GoogleLogo.svg"
import { Link, Routes, Route, useNavigate } from "react-router-dom"
import { register, reset, login, googleAuth } from "../feature/auth/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from "axios"

function SignInSelections(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isError, isSuccessful, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {        
        if(isError){
            alert(message)
        }
        if(isSuccessful || user){
            // navigate('/home')
        }

        dispatch(reset());
    }, [user, isError, isSuccessful, message, navigate, dispatch])
    
    const responseSuccessGoogle = async(res) => {
        console.log(res)
        const code = res.code
        dispatch(googleAuth({code}));
    }
    
    const responseErrorGoogle = (err) => {
        console.log(err)
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseSuccessGoogle,
        onError: responseErrorGoogle,
        flow: 'auth-code',
    })
    return(
        <div className={style.content}>
            <div className={style.googleWrapper} 
            onClick={()=>googleLogin()}
            >                
                <div className={style.googlePositioner}>
                    <img src={GoogleLogo} className={style.GoogleLogo}/>
                    <div className = {style.GoogleSignInText}>
                        Continue with Google
                    </div>
                    {/* <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        render={renderProps => (
                            <>
                            <button onClick={renderProps.onClick} style={{
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight:"normal",
                                fontStyle:"normal",
                                fontSize: `${4}vw`,
                                color:"rgb(69, 69, 69)",
                                background:"transparent",
                                border:"none",
                                width:"80vw",
                                height: "10vw",
                                cursor:"pointer",
                                borderRadius:"10vw",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <img src={GoogleLogo} className={style.GoogleLogo} alt=""/>
                                Continue with Google
                            </button>
                            </>
                          )}
                        onSuccess={responseSuccessGoogle}
                        onFailure={responseErrorGoogle}
                        cookiePolicy={'single_host_origin'}
                    /> */}
                </div>
            </div>
            {/* <div className={style.appleWrapper}>
                <div className={style.applePositioner}>
                    <img src={AppleLogo} className={style.AppleLogo}/>
                    <div className = {style.AppleSignInText}>
                    Continue with Apple
                    </div>
                </div>
            </div> */}
            <div className={style.separateLine}>
            其他方式
            </div>
            <Link to="/signin">
                <div className={style.SignInButton}>
                    邮箱登入
                </div>
            </Link>
            <Link to="/signup">
                <div className={style.SignUpButton}>
                    邮箱注册
                </div>
            </Link>
        </div>
    )
}

export function SignInForm(){
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccessful, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {        
        if(isError){
            alert(message)
        }
        if(user && user.isEmailVerified){
            navigate('/home')
        }

        dispatch(reset());
    }, [user, isError, isSuccessful, message, navigate, dispatch])

    const submit = () => {
        
        const userData = {email, password}

        dispatch(login(userData));
    }
    return(
        <div className={style.page}>
            <Header />
            <div className={style.FormContent}>
                <div className={style.emailWrapper}>
                    <div className={style.emailText}>
                        邮箱
                    </div>
                    <div className={style.emailInputWrapper}>
                        <input type="email" className={style.emailInput} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className={style.passwordWrapper}>
                    <div className={style.passwordText}>
                        密码
                    </div>
                    <div className={style.passwordInputWrapper}>
                        <input type="password" className={style.emailInput} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className={style.forgotPassword}>
                        忘记密码？
                    </div>
                </div> 
                <div className={style.SignInButton} onClick={submit}>
                        登入
                    </div>
                <Link to="/signup">
                <div className={style.SignUpButton}>
                        我要注册
                </div>
                </Link>
                <Link to="/">
                    <div className={style.backWrapper}>
                        登入选项
                    </div>
                </Link>
            </div>
        </div>
    )
};

export function SignUpForm(){
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [repeatPassword, setRepeatPassword] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccessful, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {        

        if(isError){
            alert(message)
        }
        if(user && user.isEmailVerified){
            navigate('/home')
        }

        dispatch(reset());
    }, [user, isError, isSuccessful, message, navigate, dispatch])

    const submit = () => {
        // e.preventDefault();
        // console.log("here")
        if(password !== repeatPassword){
            alert("password do not match")
        }else{
            const userData = {
                username, email, password
            }

            dispatch(register(userData));
        }
    }
    return(
        <div className={style.page}>
            <Header />
            <div className={style.FormContent}>
                <div className={style.emailWrapper}>
                    <div className={style.emailText}>
                        用户名
                    </div>
                    <div className={style.emailInputWrapper}>
                        <input type="text" className={style.emailInput} onChange={(e)=>setUsername(e.target.value)}/>
                    </div>
                </div>
                <div className={style.emailWrapper}>
                    <div className={style.emailText}>
                        邮箱
                    </div>
                    <div className={style.emailInputWrapper}>
                        <input type="email" className={style.emailInput} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className={style.passwordWrapper}>
                    <div className={style.passwordText}>
                        密码
                    </div>
                    <div className={style.passwordInputWrapper}>
                        <input type="password" className={style.emailInput} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                </div> 
                <div className={style.passwordWrapper}>
                    <div className={style.passwordText}>
                        重复密码
                    </div>
                    <div className={style.passwordInputWrapper}>
                        <input type="password" className={style.emailInput} onChange={(e)=>setRepeatPassword(e.target.value)}/>
                    </div>
                </div> 
                    <div className={style.SignUpButton} onClick={submit} >
                        注册
                    </div>
                <Link to="/signin">
                    <div className={style.SignInButton}>
                        我要登入
                    </div>
                </Link>
                <Link to="/">
                    <div className={style.backWrapper}>
                        登入选项
                    </div>
                </Link>
            </div>
        </div>
    )
}
function Header(){
    return(
        <>
            <div className={style.header}>
                <div className={style.logoTextIconWrapper}>
                    <div className={style.logoWrapper}>
                        <img src={logo} className={style.logo}/>
                    </div>
                    <div className={style.slogan}>
                        <div className={style.bigSlogan}>
                        彼邻会
                        </div>
                        <div className={style.smallSlogan}>
                        发现 <span style={{color:"#4FAEF9",fontWeight: "bold"}}>@周边 事</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export function SignInPage(){
    return(
        <div className={style.page}>
            <Header />
            <SignInSelections />
        </div>
    )
}


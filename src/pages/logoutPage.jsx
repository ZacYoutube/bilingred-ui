import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { logOut, reset } from "../feature/auth/authSlice";

export default function LogoutPage(props){
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        dispatch(logOut(props.isGoogle, false));
        dispatch(reset());
        navigate("/");
    },[dispatch, user]);

    return(
        <></>
    )
}
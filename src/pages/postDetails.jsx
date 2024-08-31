import { useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import ImagePost from "../components/post";
import Comments from "../components/comments";
import { getComments } from "../feature/comment/commentSlice";
import { sortTime } from "../api/sortTime";
import style from "../styles/postDetails.module.css";

export default function PostDetailsPage(){
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const postState = location?.state;

    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        const data = {
            user: user,
            postId: postState._id
        }
        dispatch(getComments(data)).then((res)=>{
            if(res.payload) {
                setPostComments(sortTime(res.payload));
            }
        });
    },[dispatch, user]);

    return(
        <div className={style.contentWrapper}>
            <div>
                <ImagePost {...postState} />
            </div>
            <div>
                <Comments postComments={postComments} postId={postState._id} />
            </div>
        </div>
    )
}
import style from "../styles/collectionPage.module.css"
import ImagePost from "../components/post";
import background from "../images/collectionPageBackground.svg"
import { NavLink, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect,useState } from "react"
import { getStarredPosts } from '../feature/post/postSlice';
import ReactLoading from 'react-loading';

export default function CollectionPage(){
    const { user } = useSelector((state) => state.auth);
    const { starredPosts, loading } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [favoritePostList, setFavoritePostList] = useState([]);
    
    useEffect(() => {
        if(user){
            dispatch(getStarredPosts({user: user}));
        }else{
            navigate("/")
        }
       
    },[dispatch, user]);

    useEffect(() => {
        if(starredPosts)
            setFavoritePostList(starredPosts);
    }, [starredPosts]);

    return(
        <div className={style.content}>
            <div className={style.header}>
                 我收藏的帖子
            </div>
            {
                loading 
                ?
                <ReactLoading type={'bubbles'} color={'gray'} height={'25%'} width={'25%'} />
                :
                (Array.isArray(starredPosts) && starredPosts?.length === 0) || starredPosts === null ?
                <>
                <div className={style.nothing}>
                    你还没有收藏帖子，去 <NavLink to="/home">看看帖</NavLink>
                </div>
                <div className = {style.backgroundWrapper}>
                    <img src={background} className={style.background} alt=""/>
                </div>
                </>
                :
                <>
                {
                favoritePostList.map((item, index)=>{
                    return(
                        <div className="Posts_Positioner" key={index}>
                            <ImagePost {...item}/>
                        </div>
                    )
                })
                }
                </>
            }
            

        </div>
    )
}
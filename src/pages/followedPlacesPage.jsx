import style from "../styles/followedPlacesPage.module.css"
import background from "../images/collectionPageBackground.svg"
import { NavLink, useNavigate } from "react-router-dom"
import PlaceCard from "../components/placeCard"
import { useDispatch, useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { getMyPlaces, searchPlaces } from "../feature/place/placeSlice";
import ReactLoading from 'react-loading';

export default function FollowedPlacesPage(){
    const { user } = useSelector((state)=>state.auth);
    const { loading,myPlaceList } = useSelector((state)=>state.place);
    const [myPlace, setMyPlace] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(user){
            dispatch(getMyPlaces(user?.followedPlaces)).then(res => {
                setMyPlace(res.payload);
            });
        }else{
            navigate("/");
        }
        
    },[dispatch, user])

    return(
        <div className={style.content}>
            <div className={style.header}>
                正在关注的周边
            </div>
            {
            loading 
            ?
            <ReactLoading type={'bubbles'} color={'gray'} height={'25%'} width={'25%'} />
            :
            (Array.isArray(myPlaceList) && myPlaceList?.length === 0) || myPlaceList.length === null
            ?
                <>   
                <div className={style.nothing}>
                    你还没有关注周边，去 <NavLink to="/places">关注或者创建一个周边</NavLink>
                </div>
                <div className = {style.backgroundWrapper}>
                    <img src={background} className={style.background} alt=""/>
                </div>
                </>
            :
            
            myPlace.map((place, i)=>{   
                return (                    
                    <PlaceCard 
                        name={place.name}
                        tags={place.type}
                        location={place.address}
                        placeId={place._id}
                        key = {i}/>
                )
            })
 
            }           
        </div>             
    )
}
import style from "../styles/placeCard.module.css"
import { useDispatch, useSelector } from "react-redux"
import { followAPlace, unfollowAPlace } from "../feature/place/placeSlice";
import { getUser } from "../feature/auth/authSlice";
import { getMyPlaces } from "../feature/place/placeSlice";
import { useEffect } from "react";

export default function PlaceCard(props){
    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccessful, message } = useSelector(
        (state) => state.auth
    )
    const follow = () => {
        console.log(props.placeId)
        if(props && props.placeId){
            const data = {
                user: user,
                placeId: props.placeId,
                token: user.token
            }
            dispatch(followAPlace(data)).then(()=>{
                dispatch(getUser(data));
            });
            
        }
            
    }

    const unfollow = () => {
        if(props && props.placeId){
            const data = {
                user: user,
                placeId: props.placeId,
                token: user.token
            }
            dispatch(unfollowAPlace(data)).then(() => {
                dispatch(getUser(data));
                dispatch(getMyPlaces(user.followedPlaces));
            }
            )
            
        }
            
    }

    return(    
    
    <div className={style.contentWrapper}>
        <div className={style.content}>
            <div className={style.name}>
                {props.name}
            </div>
            <div className={style.location}>
                {props.location}
            </div>
            <div className={style.buttons}>
                {

                    !user?.followedPlaces.includes(props.placeId) || user?.followedPlaces.length === 0 
                    ?
                    <div className={style.followButton} onClick={follow}>
                        关注
                    </div>
                    :
                    <div className={style.unfollowButton} onClick={unfollow}>
                        取消关注
                    </div>
                }
                
                <div className={style.mapButton}>
                    地图查看
                </div>
            </div>
        </div>
    </div>
    
    )

}
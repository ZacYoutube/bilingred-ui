
import style from "../styles/placeExplorePage.module.css"
import search from "../images/search.svg"
import arrowUp from "../images/arrowUp.svg"
import followedPlaces from "../images/followedPlaces.svg"
import PlaceCard from "../components/placeCard"
import { useDispatch, useSelector } from "react-redux"
import { getPlace, searchPlaces } from "../feature/place/placeSlice"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"


export default function PlaceExplorePage(){
    const dispatch = useDispatch()
    const [ statePlaceList, setStatePlaceList ] = useState([]);
    const { placeList } = useSelector(
        (state) => state.place
    )

    useEffect(() => {
        dispatch(getPlace());
    }, [dispatch]);
    
    useEffect(() => {
        if (placeList.place) {
            setStatePlaceList(placeList.place);
        }
    }, [placeList.place]);
    

    
    return(
        <div className={style.content}>
            <SearchPlace />
            <NavigationPad/>
            <div className={style.newestPlaces}>
                最新添加的周边
            </div>
            {
                statePlaceList && statePlaceList.map(function(place, i) {
                    return (
                        <PlaceCard 
                            name={place.name}
                            tags={place.type}
                            location={place.address}
                            placeId={place._id}
                            key = {i}
                        />
                    )
                })
            }
        </div>
    )
}

export function SearchPlace(){
    const [query, setQuery] = useState('');
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const { placeSearchResult } = useSelector((state)=>state.place);
    function searchDB(e){
        if(e.key === 'Enter' || e.which === 13){
            // dispatch(searchPlaces({query: query}));
            const queryString = "?q=" + query
            const searchParam = new URLSearchParams(queryString);
            navigate('/search' + queryString, {state:{postSearch:false, placeSearch: true}})
           }     
    }
    useEffect(()=>{
        console.log(placeSearchResult);
    },[placeSearchResult]);

    return(
        <div className={style.header}>
            <div className={style.search}>
                <div className={style.searchIconWrapper}>
                    <img className={style.searchIcon} src={search} alt=""/>
                </div>
                <input type="search" placeholder="搜索现有周边" className={style.searchInput} onChange={(e)=>setQuery(e.target.value)} onKeyPress={(e)=>searchDB(e)} />
            </div>
            <NavLink to="/myPlaces">
                <div className={style.followedPlacesIconWrapper}>
                    <img src={followedPlaces} className={style.followedPlacesIcon} alt=""/>
                </div>
            </NavLink>
        </div>
    )
}

function NavigationPad(){
    return(
        <div className={style.padWrapper}>
        <div className={style.pad}>
            <div className={style.slogan}>
                找周边的其他方式
            </div>
            <div className={style.text}>
                用所属城市来寻找周边，或者申请创建新的周边。
            </div>
            <div className={style.buttons}>
                <div className={style.filterButton}>
                    按城市筛选
                </div>
                <div className={style.createButton}>
                    申请新的周边
                </div>
            </div>
        </div>
    </div>
    )
}

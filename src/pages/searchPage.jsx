import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useSearchParams, useLocation } from "react-router-dom"
import { searchPosts } from "../feature/post/postSlice";
import { searchPlaces } from "../feature/place/placeSlice";
import { useRef, useState } from "react";
import InfiniteScroll from "../api/InfiniteScroll";
import ImagePost from "../components/post";
import PlaceCard from "../components/placeCard"
import { getCount4Spec } from "../feature/post/postSlice";
import TopNav from "../components/navigationTop";
import { SearchPlace } from '../pages/placeExplorePage';
import style from "../styles/searchPage.module.css"

export default function SearchPage(){
    let [searchParams, setSearchParams] = useSearchParams();
    const PostRadius = 10;
    const renderLength = 10;
    const { postSearchResult } = useSelector((state) => state.post)
    const { placeSearchResult } = useSelector((state) => state.place)
    const previousSearchResult = useRef(null)
    const previousPlaceSearchResults = useRef(null)
    const [data, setData] = useState([])
    const [resultCount, setResultCount] = useState(0);
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const location = useLocation();

    const postSearch = location.state.postSearch;
    const placeSearch = location.state.placeSearch;

    useEffect(()=>{
        if(postSearch)
            dispatch(searchPosts({query: searchParams.get('q')}));
        else if(placeSearch)
            dispatch(searchPlaces({query: searchParams.get('q')}));

    },[searchParams.get('q')])
    useEffect(()=>{
        // run useEffect only once when searchResult JSON value changes
        if(postSearch){
            if(JSON.stringify(postSearchResult) === JSON.stringify(previousSearchResult.current)) return
            else 
            {   
                setData(postSearchResult)
                setResultCount(postSearchResult.length)
                previousSearchResult.current = postSearchResult
            } 
        }else if(placeSearch){
            if(JSON.stringify(placeSearchResult) === JSON.stringify(previousPlaceSearchResults.current)) return
            else 
            {   
                setData(placeSearchResult)
                setResultCount(placeSearchResult.length)
                previousPlaceSearchResults.current = placeSearchResult
            } 
        }
        
    },[postSearchResult, user, placeSearchResult, placeSearch, postSearch])

    async function getNextList(currentLength){
        return new Promise((resolve, reject) =>{
            if(postSearch){
                setTimeout(() =>{
                    const componentsToRender = data.slice(currentLength, currentLength+renderLength).map((props)=><ImagePost {...props}/>)
                    resolve(componentsToRender)
                }, 1000)
            }
            else if(placeSearch){
                setTimeout(() =>{
                    const componentsToRender = data.slice(currentLength, currentLength+renderLength).map((props)=><PlaceCard name={props.name} location={props.address} placeId={props._id}/>)
                    resolve(componentsToRender)
                }, 1000)
            }
            
        })
    }

    return(
        <div className = {style.content}>
            {
                postSearch ? 
                <TopNav userInfo={user}/>
                :
                <SearchPlace />
            }
            
            <div className = "Posts_Positioner" key={JSON.stringify(data)}>
                <InfiniteScroll getNextList={getNextList} preRenderRadius={PostRadius} rowCount={resultCount}/>
            </div>
        </div>

    )
}


import axios from 'axios';

const PLACE_URL = `${process.env.REACT_APP_API_URL}/place`;
const USER_URL = `${process.env.REACT_APP_API_URL}/user`;

// get places
const getPlace = async() => {
    const response = await axios.get(PLACE_URL + '/');
    return response.data;
}

const getMyPlaces = async(idList) =>{
    const res = [];
    for(const placeId of idList){
        const response = await axios.get(PLACE_URL + `/${placeId}`);
        res.push(response.data);
    }

    return res;
}

const followAPlace = async(data) => {
    const user = data.user, placeId = data.placeId;
    let followedPlaces = [...user.followedPlaces];

    if(!followedPlaces.includes(placeId)){
        followedPlaces.push(placeId);
    }

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.patch(USER_URL + '/update', {
        favoritePostList: user.favoritePostList,
        favoriteEventList: user.favoriteEventList,
        profilePictureURL: user.profilePictureURL,
        userDisplayName: user.userDisplayName,
        followedPlaces: followedPlaces,
        isGoogle: user.isGoogle,
        token: user.token 
    },
    config
    )

    return response.data;
}

const unfollowAPlace = async(data) => {
    const user = data.user, placeId = data.placeId;
    let followedPlaces = [...user.followedPlaces];

    if(followedPlaces.includes(placeId)){
        let index = followedPlaces.indexOf(placeId);
        followedPlaces.splice(index, 1);
    }
    
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.patch(USER_URL + '/update', {
        favoritePostList: user.favoritePostList,
        favoriteEventList: user.favoriteEventList,
        profilePictureURL: user.profilePictureURL,
        userDisplayName: user.userDisplayName,
        followedPlaces: followedPlaces,
        isGoogle: user.isGoogle
        
    },
    config
    )

    return response.data;
}

// /search/params
const searchPlaces = async(data) => {
    const query = data.query;
    const response = await axios.get(PLACE_URL + `/search/params?query=${query}`);
    
    return response;
}

const placeService = {
    getPlace,
    followAPlace,
    unfollowAPlace,
    getMyPlaces,
    searchPlaces
}

export default placeService;

import axios from 'axios';

const PLACE_URL = `${process.env.REACT_APP_API_URL}/place`;
const USER_URL = `${process.env.REACT_APP_API_URL}/user`;
const POST_URL = `${process.env.REACT_APP_API_URL}/post`;

// get user's posts
const getMyPost = async(data) => {   
    const user = data.user;

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.post(POST_URL + `/myPost/${user._id}`, {
        isGoogle: user.isGoogle,
        refresh_token: user.refresh_token
    },
        config
    )
    
    return response.data;
}

// delete user's post
const deletePost = async(data) => {
    const user = data.user;
    const post = data.post;

    const response = await axios.delete(POST_URL + `/deletePost/${post._id}`, { 
        data: { 
            isGoogle: user.isGoogle 
        },
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    },
    )

    return response.data;
}

// get all post
const getAllPosts = async(data) => {
    const page = data.page, limit = data.limit, user = data.user;

    const response = await axios.post(POST_URL + `?page=${page}&limit=${limit}`,{
        followedPlaces: user.followedPlaces
    });

    return response;

}

// get row count
const getRowCount = async() => {
    const response = await axios.get(POST_URL + '/getCount');

    return response;
}

const getCount4Spec = async(data) => {
    const response = await axios.post(POST_URL + '/spec',{
        followedPlaces: data.user.followedPlaces
    });

    return response;

}


const postContent = async(data) => {
    const user = data.user,
          placeId = data.placeId,
          title = data.title,
          text = data.text,
          image = data.image,
          at = data.at,
          html = data.html;

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };
    const response = await axios.post(POST_URL + '/postContent', {
        title: title,
        image: image,
        text : text,
        placeId: placeId,
        at: at,
        isGoogle: user.isGoogle,
        html: html
    },
        config
    )

    return response.data;
}

const starAPost = async(data) => {
    const user = data.user, postId = data.postId;
    let favoritePostList = [...user.favoritePostList];

    if(!favoritePostList.includes(postId)){
        favoritePostList.push(postId);
    }

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.patch(USER_URL + '/update', {
        favoritePostList: favoritePostList,
        favoriteEventList: user.favoriteEventList,
        profilePictureURL: user.profilePictureURL,
        userDisplayName: user.userDisplayName,
        followedPlaces: user.followedPlaces,
        isGoogle: user.isGoogle,
        token: user.token 
    },
    config
    )

    return response.data;
}

const unstarAPost = async(data) => {
    const user = data.user, postId = data.postId;
    let favoritePostList = [...user.favoritePostList];

    if(favoritePostList.includes(postId)){
        let index = favoritePostList.indexOf(postId);
        favoritePostList.splice(index, 1);
    }

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.patch(USER_URL + '/update', {
        favoritePostList: favoritePostList,
        favoriteEventList: user.favoriteEventList,
        profilePictureURL: user.profilePictureURL,
        userDisplayName: user.userDisplayName,
        followedPlaces: user.followedPlaces,
        isGoogle: user.isGoogle,
        token: user.token 
    },
    config
    )

    return response.data;
}

const getStarredPosts = async(data) => {
    
    const user = data.user;
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };
    const response = await axios.post(POST_URL + '/starred', {
        isGoogle: user.isGoogle
    },config);
    return response.data;
}


const updatePost = async(data) => {
    const post = data.post;
    const user = data.user;
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };
    const response = await axios.patch(POST_URL + `/editPost/${post.postId}`,{
        title : post.title,
        image: post.image,
        text: post.text,
        isGoogle: user.isGoogle,
        html: post.html
    },
    config);
    return response;
}

const searchPosts = async(data) => {
    const query = data.query;
    const response = await axios.get(POST_URL + `/search?query=${query}`);
    
    return response;
}

const postService = {
    postContent,
    getMyPost,
    deletePost,
    getAllPosts,
    getRowCount,
    getCount4Spec,
    updatePost,
    searchPosts,
    starAPost,
    unstarAPost,
    getStarredPosts
}

export default postService;

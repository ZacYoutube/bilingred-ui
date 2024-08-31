import axios from 'axios';

const COMMENT_URL = `${process.env.REACT_APP_API_URL}/comment`;

const getComments = async(data) => {
    const user = data.user;
    const postId = data.postId;

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.post(COMMENT_URL + `/${postId}`, {isGoogle: user.isGoogle}, config);
    return response.data;
}

const addComment = async(data) => {
    const user = data.user,
          postId = data.postId,
          body = data.body,
          userId = user._id,
          username = user.name,
          userProfileImage = user.profilePictureURL;
    let parentId = null;
    if (data.parentId) parentId = data.parentId;

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const response = await axios.post(COMMENT_URL + '/', {
        userId: userId,
        username: username,
        body: body,
        userProfileImage: userProfileImage,
        postId: postId,
        parentId: parentId,
        isGoogle: user.isGoogle
    },
        config
    )

    return response.data;
}

const editComment = async(data) => {
    const comment = data.comment;
    const user = data.user;
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };
    const response = await axios.patch(COMMENT_URL + `/${comment.commentId}`,{
       body: comment.body,
       parentId: comment.parentId,
       isGoogle: user.isGoogle
    },
    config);
    return response;
}

const deleteComment = async(data) => {
    const user = data.user;
    const comment = data.comment;

    const response = await axios.delete(COMMENT_URL + `/${comment.commentId}`, { 
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

const commentService = {
    getComments,
    addComment,
    deleteComment,
    editComment
}

export default commentService;

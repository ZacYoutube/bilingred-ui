import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/user`;

//register
const register = async(userData) => {
    const response = await axios.post(API_URL + '/register', userData);
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

// logout
const logOut = () => {
    localStorage.removeItem('user');
    window.location.href = "/";
}

// login
const login = async(userData) => {
    const response = await axios.post(API_URL + '/login', userData);
    const user = response.data;
    if(user && user.isEmailVerified){
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return user;
}

// google auth
const googleAuth = async(token) => {
    const response = await axios.post(API_URL + '/google/auth', token);
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

const getUser = async(data) => {
    const response = await axios.get(API_URL + `/refresh/${data.user._id}`);
    let userObject = response.data;
    userObject['token'] = data.token;
    localStorage.setItem('user', JSON.stringify(userObject));
    return userObject;
}

const findUser = async(data) => {
    const response = await axios.get(API_URL + `/${data.userId}`);
    return response.data;
}

const authService = {
    register,
    logOut,
    login,
    googleAuth,
    getUser,
    findUser
}

export default authService;

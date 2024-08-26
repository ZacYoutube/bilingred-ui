import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { googleLogout } from '@react-oauth/google';

// get user from localstorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user : user ? user : null,
    isError: false,
    isSuccessful: false,
    isLoading: false,
    isGoogle: false,
    isApple: false,
    message: "",
    retrievedUser: null
}

// register user
export const register = createAsyncThunk('auth/register', async(user, thunkAPI) => {
    try{
        return await authService.register(user)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

// login user
export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try{
        return await authService.login(user)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

// logout
export const logOut = createAsyncThunk('auth/logout', async(isGoogle=false, isApple=false)=>{
    await authService.logOut();
    if(isGoogle){
        googleLogout();
    }
})

// google auth
export const googleAuth = createAsyncThunk('auth/google', async(token, thunkAPI)=>{
    try{
        return await authService.googleAuth(token);
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

// refresh info
export const getUser = createAsyncThunk('auth/refresh', async(data, thunkAPI)=>{
    try{
        return await authService.getUser(data);
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})


export const findUser = createAsyncThunk('auth/findUser', async(data, thunkAPI)=>{
    try{
        return await authService.findUser(data);
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        reset:(state)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccessful = false;
            state.message = '';
            state.isGoogle = false;
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(register.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccessful = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logOut.fulfilled, (state)=>{
                state.user = null;
            })
            .addCase(login.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccessful = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(googleAuth.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(googleAuth.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccessful = true;
                state.isGoogle = true;
                state.user = action.payload;
            })
            .addCase(googleAuth.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.isGoogle = false;
            })
            .addCase(getUser.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(getUser.fulfilled,(state, action)=>{
                state.isLoading = false;
                state.isSuccessful = true;
                state.user = action.payload;
            })
            .addCase(getUser.rejected,(state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(findUser.pending,(state)=>{
                console.log("retrieve pending")
                state.isLoading = true;
            })
            .addCase(findUser.fulfilled,(state, action)=>{
                console.log("retrieve sucess", action.payload)
                state.isLoading = false;
                state.isSuccessful = true;
                state.retrievedUser = action.payload;
            })
            .addCase(findUser.rejected,(state, action)=>{
                console.log("retrieve fail", action.payload)
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.retrievedUser = null;
            })
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer
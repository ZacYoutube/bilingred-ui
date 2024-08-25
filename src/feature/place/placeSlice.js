import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import placeService from './placeService';

const initialState = {
    placeList : [],
    myPlaceList: [],
    loading: false,
    success: false,
    error: false,
    msg: null,
    placeSearchResult: null,
}

// get placeList
export const getPlace = createAsyncThunk('place/getPlace', async(thunkAPI) => {
    try{
        return await placeService.getPlace()
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

// allows user to follow a place
export const followAPlace = createAsyncThunk('place/followAPlace', async(data, thunkAPI) => {
    try{
        return await placeService.followAPlace(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const unfollowAPlace = createAsyncThunk('place/unfollowAPlace', async(data, thunkAPI) => {
    try{
        return await placeService.unfollowAPlace(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getMyPlaces = createAsyncThunk('place/getMyPlaces', async(data, thunkAPI) => {
    try{
        return await placeService.getMyPlaces(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const searchPlaces = createAsyncThunk('place/searchPlaces', async(data, thunkAPI) => {
    try{
        return await placeService.searchPlaces(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const placeSlice = createSlice({
    name: "place",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getPlace.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getPlace.fulfilled, (state, action)=>{
                state.placeList = action.payload;
                state.success = true;
                state.loading = false;
                state.error = false;
            })
            .addCase(getPlace.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(followAPlace.fulfilled, (state, action)=>{
                console.log("follow success")
            })
            .addCase(unfollowAPlace.fulfilled, (state, action)=>{
                console.log("unfollow success")
            })
            .addCase(getMyPlaces.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getMyPlaces.fulfilled, (state, action)=>{
                state.myPlaceList = action.payload;
                state.success = true;
                state.loading = false;
                state.error = false;
            })
            .addCase(getMyPlaces.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
                state.myPlaceList = null;
            })
            .addCase(searchPlaces.pending, (state)=>{
                state.loading = true;
            })
            .addCase(searchPlaces.fulfilled, (state, action)=>{
                state.placeSearchResult = action.payload.data;
                state.success = true;
                state.loading = false;
                state.error = false;
            })
            .addCase(searchPlaces.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
                state.placeSearchResult = null;
            })
            
    }
})

export default placeSlice.reducer
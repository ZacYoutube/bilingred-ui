import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';

const initialState = {
    postList : null,
    myPost:null,
    msg: "",
    error: false,
    successful: false,
    loading: false,
    total: 0,
    postSearchResult: null,
    starredPosts: null
}

export const postContent = createAsyncThunk('post/postContent', async(data, thunkAPI) => {
    try{
        return await postService.postContent(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getMyPost = createAsyncThunk('post/getMyPost', async(data, thunkAPI) => {
    try{
        return await postService.getMyPost(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const deletePost = createAsyncThunk('post/deletePost', async(data, thunkAPI) => {
    try{
        return await postService.deletePost(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getAllPosts = createAsyncThunk('post/getAllPosts', async(data, thunkAPI) => {
    try{
        return await postService.getAllPosts(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getRowCount = createAsyncThunk('post/getRowCount', async(thunkAPI) => {
    try{
        return await postService.getRowCount()
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getCount4Spec = createAsyncThunk('post/getCount4Spec', async(data, thunkAPI) => {
    try{
        return await postService.getCount4Spec(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const updatePost = createAsyncThunk('post/updatePost', async(data, thunkAPI) => {
    try{
        return await postService.updatePost(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const searchPosts = createAsyncThunk('post/searchPosts', async(data, thunkAPI) => {
    try{
        return await postService.searchPosts(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const starAPost = createAsyncThunk('post/starAPost', async(data, thunkAPI) => {
    try{
        return await postService.starAPost(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const unstarAPost = createAsyncThunk('post/unstarAPost', async(data, thunkAPI) => {
    try{
        return await postService.unstarAPost(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getStarredPosts = createAsyncThunk('post/getStarredPosts', async(data, thunkAPI) => {
    try{
        return await postService.getStarredPosts(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})



export const postSlice = createSlice({
    name: "post",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder)=>{
        builder
            .addCase(postContent.pending, (state)=>{
                state.loading = true;
            })
            .addCase(postContent.fulfilled, (state, action)=>{
                console.log("post success")
                state.loading = false;
                state.error = false;
                state.successful = true;
            })
            .addCase(postContent.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(getMyPost.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getMyPost.fulfilled, (state, action)=>{
                console.log("get post success")
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.myPost = action.payload;
            })
            .addCase(getMyPost.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
                state.myPost = null;
            })
            .addCase(deletePost.pending, (state)=>{
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state, action)=>{
                console.log("delete post success")
                state.loading = false;
                state.error = false;
                state.successful = true;
            })
            .addCase(deletePost.rejected, (state, action)=>{
                console.log("delete post fail")
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(getAllPosts.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action)=>{
                // console.log("get all post success", action.payload)
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.postList = action.payload.data.data;
                // state.total = action.payload.data.total;
            })
            .addCase(getAllPosts.rejected, (state, action)=>{
                // console.log("get all post fail")
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
                state.postList = null;
            })
            .addCase(getRowCount.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getRowCount.fulfilled, (state, action)=>{
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.total = action.payload.data.count;
            })
            .addCase(getRowCount.rejected, (state, action)=>{
                // console.log("get all post fail")
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(searchPosts.pending, (state)=>{
                state.loading = true;
            })
            .addCase(searchPosts.fulfilled, (state, action)=>{
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.postSearchResult = action.payload.data;
            })
            .addCase(searchPosts.rejected, (state, action)=>{
                // console.log("get all post fail")
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(getStarredPosts.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getStarredPosts.fulfilled, (state, action)=>{
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.starredPosts = action.payload.tempList;
            })
            .addCase(getStarredPosts.rejected, (state, action)=>{
                // console.log("get all post fail")
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            
    }
})

export default postSlice.reducer
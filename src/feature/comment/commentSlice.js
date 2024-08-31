import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from './commentService';

const initialState = {
    msg: "",
    error: false,
    successful: false,
    loading: false
}

export const addComment= createAsyncThunk('comment/addComment', async(data, thunkAPI) => {
    try{
        return await commentService.addComment(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const getComments = createAsyncThunk('comment/getComments', async(data, thunkAPI) => {
    try{
        return await commentService.getComments(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const deleteComment = createAsyncThunk('comment/deleteComment', async(data, thunkAPI) => {
    try{
        return await commentService.deleteComment(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const editComment = createAsyncThunk('comment/editComment', async(data, thunkAPI) => {
    try{
        return await commentService.editComment(data)
    }catch(err){
        const message = ((err.response && err.response.data && err.response.data.message) ||
                         err.message || err.toString());
        
        return thunkAPI.rejectWithValue(message);
    }
})

export const commentSlice = createSlice({
    name: "comment",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder)=>{
        builder
            .addCase(addComment.pending, (state)=>{
                state.loading = true;
            })
            .addCase(addComment.fulfilled, (state, action)=>{
                console.log("add comment success")
                state.loading = false;
                state.error = false;
                state.successful = true;
            })
            .addCase(addComment.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(getComments.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getComments.fulfilled, (state, action)=>{
                console.log("get comments success")
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.myPost = action.payload;
            })
            .addCase(getComments.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
                state.myPost = null;
            })
            .addCase(deleteComment.pending, (state)=>{
                state.loading = true;
            })
            .addCase(deleteComment.fulfilled, (state, action)=>{
                console.log("delete comment success")
                state.loading = false;
                state.error = false;
                state.successful = true;
            })
            .addCase(deleteComment.rejected, (state, action)=>{
                console.log("delete post fail")
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
            })
            .addCase(editComment.fulfilled, (state, action)=>{
                state.loading = false;
                state.error = false;
                state.successful = true;
                state.postList = action.payload.data.data;
            })
            .addCase(editComment.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.msg = action.payload;
                state.postList = null;
            })
            .addCase(editComment.pending, (state)=>{
                state.loading = true;
            })
    }
})

export default commentSlice.reducer
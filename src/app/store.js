import { configureStore  } from "@reduxjs/toolkit";
import authReducer from '../feature/auth/authSlice';
import placeReducer from '../feature/place/placeSlice';
import postReducer from '../feature/post/postSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        place: placeReducer,
        post: postReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})
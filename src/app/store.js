import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
 
  userData: {},
  userFavSubs: []
};

const redditSlice = createSlice({
  name: "reddit",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserFavSubs: (state, action)=>{
      state.userFavSubs = action.payload
    }
  },
});
export const { setUserFavSubs } = redditSlice.actions;
export const  selectUserFavSubs = (state)=> state.reddit.userFavSubs
export const { setUserData } = redditSlice.actions;
export const selectUserData = (state) => state.reddit.userData;

const store = configureStore({
  reducer: {
    reddit: redditSlice.reducer,
  },
});

export default store


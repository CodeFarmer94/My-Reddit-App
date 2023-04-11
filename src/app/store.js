import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
 
  userData: {},
  userFavSubs: [],
  theme: "light"
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
    },
    addFavSubToStore:(state, action)=>{
      state.userFavSubs.push(action.payload);
    },
    removeFavSubFromStore:(state,action)=>{
    
      state.userFavSubs= state.userFavSubs.filter(item=>{
        
        return item.data.display_name !== action.payload.data.display_name} )
    },
    toggleTheme:(state,action)=>{
      console.log(state.theme)
      state.theme = action.payload
    }
  },
});

export const { toggleTheme } = redditSlice.actions
export const selectTheme = (state) => state.reddit.theme
export const { setUserFavSubs } = redditSlice.actions;
export const  selectUserFavSubs = (state)=> state.reddit.userFavSubs
export const { setUserData } = redditSlice.actions;
export const selectUserData = (state) => state.reddit.userData;
export const {addFavSubToStore} = redditSlice.actions;
export const {removeFavSubFromStore} = redditSlice.actions
const store = configureStore({
  reducer: {
    reddit: redditSlice.reducer,
  },
});

export default store


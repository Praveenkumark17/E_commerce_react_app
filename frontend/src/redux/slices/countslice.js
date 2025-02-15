import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartcount: null,
  favcount: JSON.parse(localStorage.getItem("favcount")) || 0,
  favtrigger: false,
};

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCartcount(state, action) {
      state.cartcount = action.payload;
    },
    setFavcount(state, action) {
      state.favcount = action.payload;
    },
    setFavtrigger(state, action) {
      state.favcount = action.payload;
    },
  },
});

export const { setCartcount, setFavcount,setFavtrigger } = countSlice.actions;
export default countSlice.reducer;

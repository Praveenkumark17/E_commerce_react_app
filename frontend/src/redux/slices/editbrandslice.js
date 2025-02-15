import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editbrand: null
};

const editBrandSlice = createSlice({
  name: 'editbrand',
  initialState,
  reducers: {
    setEditBrand(state, action) {
      state.editbrand = action.payload;
    },
    clearBrandEdit(state) {
      state.editbrand = null; // Clear the edituser object
    }
  }
});

export const { setEditBrand, clearBrandEdit } = editBrandSlice.actions;
export default editBrandSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editcategory: null
};

const editCategorySlice = createSlice({
  name: 'editcategory',
  initialState,
  reducers: {
    setEditCategory(state, action) {
      state.editcategory = action.payload;
    },
    clearCategoryEdit(state) {
      state.editcategory = null; // Clear the edituser object
    }
  }
});

export const { setEditCategory, clearCategoryEdit } = editCategorySlice.actions;
export default editCategorySlice.reducer;
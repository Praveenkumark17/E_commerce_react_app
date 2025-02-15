import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editproduct: null
};

const editProductSlice = createSlice({
  name: 'editproduct',
  initialState,
  reducers: {
    setEditProduct(state, action) {
      state.editproduct = action.payload;
    },
    clearProductEdit(state) {
      state.editproduct = null; // Clear the edituser object
    }
  }
});

export const { setEditProduct, clearProductEdit } = editProductSlice.actions;
export default editProductSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: []
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = [...state.users, action.payload];
        },
        logout(state) {
            return initialState; // Reset state to initial state
        }
    }
});

export const { setUsers,logout } = userSlice.actions;
export default userSlice.reducer;
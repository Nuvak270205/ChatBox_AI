import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser(state, action) {
            state.user = action.payload?.user ?? null;
            state.token = action.payload?.token ?? null;
        },
        clearAuthUser(state) {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
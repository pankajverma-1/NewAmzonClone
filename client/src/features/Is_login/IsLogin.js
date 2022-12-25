import { createSlice } from '@reduxjs/toolkit';

export const logInSlicer = createSlice({
    name: 'LogIn',
    initialState: {
        value: { islogin: false, data: [] },
    },
    reducers: {
        LOGIN_STATUS: (state, action) => {
            const { payload } = action;

            state.value = {...state.value, islogin: payload };
        },
        USER_DATA: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, data: payload };
        },
    },
});
export const { LOGIN_STATUS, USER_DATA } = logInSlicer.actions;

export default logInSlicer.reducer;
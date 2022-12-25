import { createSlice } from '@reduxjs/toolkit';

export const dashBoardSlice = createSlice({
    name: 'dashBoard',
    initialState: {
        value: { product: [], loading: true, error: '' },
    },
    reducers: {
        DASHBOARD_DETAIL_REQUEST: (state, action) => {
            state.value = {...state.value, loading: true };
        },
        DASHBOARD_DETAIL_SUCCESS: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, product: payload, loading: false };
        },
        DASHBOARD_DETAIL_FAIL: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, loading: false, error: payload };
        },
    },
});
export const {
    DASHBOARD_DETAIL_SUCCESS,
    DASHBOARD_DETAIL_REQUEST,
    DASHBOARD_DETAIL_FAIL,
} = dashBoardSlice.actions;

export default dashBoardSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

export const fetchProductSlice = createSlice({
    name: 'fetchProduct',
    initialState: {
        value: { product: [], loading: true, error: '' },
    },
    reducers: {
        FETCH_REQUEST: (state, action) => {
            state.value = {...state.value, loading: true };
        },
        FETCH_SUCCESS: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, product: payload, loading: false };
        },
        FETCH_FAIL: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, loading: false, error: payload };
        },
        CLEAR: (state, action) => {
            state.value = {...state.value, product: [] };
        },
    },
});
export const { FETCH_SUCCESS, FETCH_REQUEST, FETCH_FAIL, CLEAR } =
fetchProductSlice.actions;

export default fetchProductSlice.reducer;
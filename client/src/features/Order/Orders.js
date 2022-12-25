import { createSlice } from '@reduxjs/toolkit';

export const fetchProductSlice = createSlice({
    name: 'fetchProduct',
    initialState: {
        value: { product: [], loading: true, error: '' },
    },
    reducers: {
        ORDERS_REQUEST: (state, action) => {
            state.value = {...state.value, loading: true };
        },
        ORDERS_SUCCESS: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, product: payload, loading: false };
        },
        ORDERS_FAIL: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, loading: false, error: payload };
        },
    },
});
export const { ORDERS_SUCCESS, ORDERS_REQUEST, ORDERS_FAIL } =
fetchProductSlice.actions;

export default fetchProductSlice.reducer;
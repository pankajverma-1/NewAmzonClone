import { createSlice } from '@reduxjs/toolkit';

export const fetchProductSlice = createSlice({
    name: 'fetchProduct',
    initialState: {
        value: { product: [], loading: true, error: '' },
    },
    reducers: {
        ORDER_REQUEST: (state, action) => {
            state.value = {...state.value, loading: true };
        },
        ORDER_SUCCESS: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, product: payload, loading: false };
        },
        ORDER_FAIL: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, loading: false, error: payload };
        },
    },
});
export const { ORDER_SUCCESS, ORDER_REQUEST, ORDER_FAIL } =
fetchProductSlice.actions;

export default fetchProductSlice.reducer;
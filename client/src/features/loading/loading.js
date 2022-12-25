import { createSlice } from '@reduxjs/toolkit';

export const loadingProductSlice = createSlice({
    name: 'loadingProduct',
    initialState: {
        value: { loading: true },
    },
    reducers: {
        LOADING_REQUEST: (state, action) => {
            state.value = { loading: true };
        },
        LOADING_SUCCESS: (state, action) => {
            state.value = { loading: false };
        },
    },
});
export const { LOADING_SUCCESS, LOADING_REQUEST } = loadingProductSlice.actions;

export default loadingProductSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

export const fetchSlice = createSlice({
    name: 'Fetchquery',
    initialState: {
        value: { products: [], loading: true, error: '' },
    },
    reducers: {
        FETCH_REQUEST: (state, action) => {
            state.value = {...state.value, loading: true };
        },
        FETCH_SUCCESS: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, products: payload, loading: false };
        },
        FETCH_FAIL: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, loading: false, error: payload };
        },
    },
});
// switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return { ...state, products: action.payload, loading: false };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;

// Action creators are generated for each case reducer function
export const { FETCH_SUCCESS, FETCH_REQUEST, FETCH_FAIL } = fetchSlice.actions;

export default fetchSlice.reducer;
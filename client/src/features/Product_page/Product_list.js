import { createSlice } from '@reduxjs/toolkit';

export const ProductsListSlice = createSlice({
    name: 'ProductsList',
    initialState: {
        value: { product: [], loading: true, error: '' },
    },
    reducers: {
        LIST_REQUEST: (state, action) => {
            state.value = {...state.value, loading: true };
        },
        LIST_SUCCESS: (state, action) => {
            const { payload } = action;
            state.value = {
                ...state.value,
                products: payload.products,
                page: payload.page,
                pages: payload.pages,
                loading: false,
            };
        },
        LIST_FAIL: (state, action) => {
            const { payload } = action;
            state.value = {...state.value, loading: false, error: payload };
        },
        REMOVE_ITEM: (state, action) => {
            const { payload } = action;
            const product = state.value.products.filter(
                (item) => item._id !== payload._id
            );
            state.value = {
                ...state.value,
                products: [...product],
            };
        },
    },
});
export const { LIST_SUCCESS, LIST_REQUEST, LIST_FAIL, REMOVE_ITEM } =
ProductsListSlice.actions;

export default ProductsListSlice.reducer;
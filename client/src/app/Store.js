import { configureStore } from '@reduxjs/toolkit';
import fetchProductReducer from '../features/Fetch_product/Fetch_Product';
import fetchReducer from '../features/FetchQu/Fetch_Query';
import cartReducer from '../features/Cart/Cart';
import logInReducer from '../features/Is_login/IsLogin';
import orderReducer from '../features/OrderDetailes/OrderDetails';
import ordersReducer from '../features/Order/Orders';
import productListReducer from '../features/Product_page/Product_list';
import dashBoardReducer from '../features/Dashboard/Dashboard';

const store = configureStore({
    reducer: {
        Fetch: fetchReducer,
        Product: fetchProductReducer,
        Cart: cartReducer,
        Login: logInReducer,
        Order: orderReducer,
        Orders: ordersReducer,
        ProductList: productListReducer,
        DashBoard: dashBoardReducer,
    },
});

export default store;
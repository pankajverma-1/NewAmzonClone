const express = require('express');
const { Auth, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer();
const {
    hello,
    products,
    singleProduct,
    findProduct,
    usersLogin,
    signup,
    Order,
    userAuth,
    OrderDetails,
    OrderHistory,
    update,
    OrderSummery,
    productsList,
    createProduct,
    uploadFile,
    deleteProduct,
    deleteImage,
    orderList,
    deleteOrder,
    userList,
    deleteUser,
    userDetail,
    editUserDetail,
    categories,
    logout,
} = require('./Controllers');

const router = express.Router();

router.get('/', hello);
router.get('/auth', Auth, userAuth);
router.get('/products', products);
router.get('/product/slug/:slug', singleProduct);
router.get('/product/:id', findProduct);
router.post('/users/login', usersLogin);
router.get('/user/logout', logout);
router.post('/users/signup', signup);
router.put('/user/update', Auth, update);
router.post('/order', Auth, Order);
router.get('/order/history', Auth, OrderHistory);
router.get('/order/:id', Auth, OrderDetails);
router.get('/orders/summary', Auth, isAdmin, OrderSummery);
router.get('/products/admin', Auth, isAdmin, productsList);
router.post(
    '/product/createProduct',
    Auth,
    isAdmin,
    upload.single('file'),
    createProduct
);
router.delete('/product/delete/:id', Auth, isAdmin, deleteProduct);
router.get('/orders/orderList', Auth, isAdmin, orderList);
router.delete('/orders/deleteOrder/:id', Auth, isAdmin, deleteOrder);
router.get('/user/userList', Auth, isAdmin, userList);
router.delete('/user/deleteUser/:id', Auth, isAdmin, deleteUser);
router.get('/user/:id', Auth, isAdmin, userDetail);
router.put('/userEdit/:id', Auth, isAdmin, editUserDetail);
module.exports = router;
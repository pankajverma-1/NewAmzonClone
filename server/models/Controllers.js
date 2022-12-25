const { Product, User, Order } = require('./dataSchema');
const bcrypt = require('bcryptjs');
const data = require('./data');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const oneMonth = 2629800000;

exports.userAuth = async(req, res) => {
    // console.log('hii');
    const _id = req.user._id;
    const userExist = await User.findOne({ _id });
    // console.log(userExist);
    res.send(userExist);
};

exports.hello = async(req, res) => {
    await Product.remove({});
    const createProducts = await Product.insertMany(data.products);
    await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createProducts, createdUsers });
};

exports.products = async(req, res) => {
    // console.log('product');
    const products = await Product.find({});
    res.send(products);
};

exports.singleProduct = async(req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    } catch (error) {
        res.status(404).send({ message: 'Product Not Found' });
    }
};

exports.findProduct = async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
};

exports.usersLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            const result = await bcrypt.compare(password, userExist.password);
            const token = await userExist.userAuth();
            // console.log(token);
            res.cookie('amazon', token, {
                expires: new Date(Date.now() + oneMonth),
                httpOnly: true,
            });
            result
                ?
                res.send(userExist).status(201) :
                res.send({ error: 'Invalid detailes' });
        }
    } catch (error) {
        // console.log(error.message);
    }
};
exports.signup = async(req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        {
            // console.log('userExist');
            res.send({ message: 'User Already Exist' });
            return;
        }
    }
    try {
        // console.log(name, email, password);
        const register = new User({
            name,
            email,
            password,
        });
        const CreateUser = await register.save();
        const token = await CreateUser.userAuth();
        // console.log(token);
        res.cookie('amazon', token, {
            expires: new Date(Date.now() + oneMonth),
            httpOnly: true,
        });
        res.send(CreateUser);
    } catch (error) {
        res.send({ error: 'server Error' });
        // console.log(error);
    }
};

exports.Order = async(req, res) => {
    try {
        // console.log('orderDetails');
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        } = req.body;

        const newOrder = new Order({
            orderItems: orderItems.map((x) => ({...x, product: x._id })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            user: req.user._id,
        });
        const orderCreate = await newOrder.save();
        res.status(201).send({ message: 'New Order Created', orderCreate });
    } catch (error) {
        // console.log(error);
    }
};
exports.OrderDetails = async(req, res) => {
    // console.log(req.params.id);
    const OrderDetails = await Order.findById(req.params.id);
    if (OrderDetails) {
        res.send(OrderDetails);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
};
exports.OrderHistory = async(req, res) => {
    const user = req.user._id;
    const allOrders = await Order.find({ user });
    if (allOrders) {
        res.send(allOrders);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
};
exports.update = async(req, res) => {
    // console.log(req.user._id);
    const user = req.user._id;
    const userExist = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    if (userExist) {
        const result = await bcrypt.compare(oldPassword, userExist.password);
        if (result) {
            const updateUser = await User.updateOne({ _id: user }, {
                password: newPassword,
            });
            console.log(updateUser);
        } else {
            res.send({ error: 'NewPassword and oldPassword do not match' });
        }
    }
};

exports.OrderSummery = async(req, res) => {
    const allOrder = await Order.find({});
    const allUser = await User.find({});
    const allProduct = await Product.find({});
    const productCategories = await Product.aggregate([{
        $group: {
            _id: '$category',
            count: { $sum: 1 },
        },
    }, ]);
    res.send({ allOrder, allUser, allProduct, productCategories });
};

exports.productsList = async(req, res) => {
    const PAGE_SIZE = 4;
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const products = await Product.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    const countProducts = await Product.countDocuments();

    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
};

exports.createProduct = async(req, res) => {
    // console.log(req.body);
    const userData = JSON.parse(req.body.data);
    const { name, slug, price, category, brand, countInStock, description } =
    userData;
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });

    try {
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: 'ECommence', width: 679, height: 829, crop: 'fill' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        const result = await streamUpload(req);
        const { url, public_id } = result;
        const newProduct = new Product({
            name,
            slug,
            image: {
                url,
                public_id,
            },
            price,
            category,
            brand,
            countInStock,
            rating: 0,
            numReviews: 0,
            description,
        });

        const product = await newProduct.save();
        res.send({ message: 'Product Created', product });
    } catch (error) {
        console.log(error);
    }
};
exports.deleteProduct = async(req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
    const product = await Product.findById(req.params.id);
    if (product) {
        const imgId = product.image.public_id;

        await cloudinary.uploader.destroy(imgId);

        await product.remove();
        res.send({ message: 'Product Deleted' });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
};
exports.orderList = async(req, res) => {
    const allOrders = await Order.find({});
    if (allOrders) {
        res.send(allOrders);
    }
};

exports.deleteOrder = async(req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        await order.remove();
        res.send({ message: 'Order deleted' });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
};

exports.userList = async(req, res) => {
    const allUser = await User.find({});
    res.send(allUser);
};

exports.deleteUser = async(req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.email === 'admin@example.com') {
            res.status(400).send({ message: 'Can Not Delete Admin User' });
            return;
        } else {
            await user.remove();
            res.send({ message: 'User deleted' });
        }
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
};
exports.userDetail = async(req, res) => {
    try {
        const userData = await User.findById(req.params.id);
        if (userData) {
            res.send(userData);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'User Not Found' });
    }
};

exports.editUserDetail = async(req, res) => {
    try {
        const { _id, name, email, isAdmin } = req.body;
        const userExist = await User.findById(_id);
        if (userExist) {
            userExist.name = name || userExist.name;
            userExist.email = email || userExist.email;
            userExist.isAdmin = Boolean(isAdmin);
            const updateUser = await userExist.save();
            res.send({ message: 'User Updated', user: updateUser });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.logout = async(req, res) => {
    res.clearCookie('amazon');
    res.status(200).send({ message: 'Logout Successfully' });
};
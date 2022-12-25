const mongoose = require('mongoose');
const Db = process.env.DATABASE;
mongoose
    .connect(Db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('connection successful');
    })
    .catch((err) => {
        console.log(err.message);
    });
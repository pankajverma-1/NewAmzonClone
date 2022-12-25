require('dotenv').config();
require('./db/conn');
const path = require('path');
const cors = require('cors');
const express = require('express');
const Router = require('./models/Routers');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dirname = path.resolve();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', Router);

app.use(express.static(path.join(dirname, '/../client/build')));
app.use(express.static(path.join(dirname, '/client/build')));
app.get('*', (req, res) =>
    res.sendFile(path.join(dirname, '/client/build/index.html'))
);

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

app.listen(port, () => console.log(`app run port ${port}`));
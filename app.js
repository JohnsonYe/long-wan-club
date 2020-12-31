/** restrict dependencies */
const express = require('express');
const http    = require("http");
const https   = require("https");
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require("body-parser");
require('dotenv').config();

const router = require('./libs/router.js');
const { handleError, ErrorHandler } = require('./libs/resHandler');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false } ));

app.use("/api", router);

app.get('/error', (req, res) => {
    throw new ErrorHandler(500, 'Internal server error');
})


app.use((err, req, res, next) => {
    handleError(err, res);
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (req, res) => {
    res.status(404).send('Error 404! Page not found 🏠');
});

const PORT = process.env.PORT || 8084;
if (process.env.SSL_ENABLE != "true") {
    http.createServer(app).listen(PORT, () => {
        console.log('Server is running on %s mode, listening at port %s', process.env.NODE_ENV , PORT || 8084);
    });
}


module.exports.app = app;
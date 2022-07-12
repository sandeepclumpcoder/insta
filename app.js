const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mainRouter = require('./src/router/index');
const fileUpload = require('express-fileupload')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// calling to a mainRouter (index.js file)

app.use('/user' , mainRouter);

// For create server

const port = 5000;

app.listen(port, () => {
    console.log(`Server started successfully at ${port}`);
});
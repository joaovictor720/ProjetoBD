const express = require('express');
const app = express();
const pool = require('./dbConnection')

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
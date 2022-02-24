const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')
const config = require('./config.json')


const app = express();


app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/hello', (req, res) => res.send("hello"))

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
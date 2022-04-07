const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')
const config = require('./config.json')
const routes = require('./routes')



const app = express();

app.use(express.static('dist'))


app.use(cors({ credentials: true, origin: ['http://localhost:1234'] }));

app.get('/hello', routes.hello)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
const express = require('express');
var cors = require('cors')
const config = require('./config.json')

const app = express();
const apiRouter = require('./routes')

app.use(express.static('dist'))

app.use(cors({ credentials: true, origin: ['http://localhost:1234'] }));

app.use(express.json())

app.use('/api', apiRouter)

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: './dist' })
})

app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
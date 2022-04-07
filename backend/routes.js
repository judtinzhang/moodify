const config = require('./config.json')
const e = require('express');

async function hello(req, res) {
    res.send({message: "hello hetvi"})
}

module.exports = {
    hello
}
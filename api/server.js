//will configure the API server
//Goal of express.json() - teach express how to parse json -- if we arent parsing dont need it

const express = require('express');

const server = express();

server.get("/", (req,res) => {
    res.status(200).json({ api: 'running' });
})

module.exports = server;
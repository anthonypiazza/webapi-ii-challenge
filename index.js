const express = require('express');

const postsRoutes = require('./posts/postsRoutes');

// const server = express();
//Heroku adds a PORT variable to the environment automatically
const port = process.env.PORT || 8000;

const server = require('./api/server')

server.use(express.json());

server.use('/api/posts', postsRoutes);

server.listen(port, () => console.log('Listening on Port 8000'))


//will run (listen for connections) the server
//separation of concerns  -  single responsibility(SRP)
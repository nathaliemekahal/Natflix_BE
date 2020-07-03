const express= require('express')
const cors=require('cors')
const {join} =require('path')
const listEndpoints = require("express-list-endpoints")

const mediaRouter=require('./services/media')
const reviewsRouter=require('./services/reviews')
const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
  } = require("./errorHandlers")

const server=express()
const port = process.env.PORT
server.use(express.json())
server.use('/media',mediaRouter)
server.use('/reviews',reviewsRouter)
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))


server.listen(port, () => {
    console.log("working on port "+port);
  });
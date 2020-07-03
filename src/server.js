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
server.use(cors());
server.use(express.json())
const whitelist =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL]
    : ["http://localhost:3000", "http://localhost:3002"]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}
server.use('/media',mediaRouter)
server.use('/reviews',reviewsRouter)
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))


server.listen(port, () => {
    console.log("working on port "+port);
  });
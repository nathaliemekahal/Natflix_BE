//LIBRARIES
const express=require('express')
const path =require('path')
const uniqid=require('uniqid')
const fs= require('fs-extra')
const {writeDB,readDB}=require('../../utilities')
const PDFDocument = require("pdfkit");
const axios = require("axios");
const {
    readFile,
    writeFile,
    createReadStream,
    createWriteStream,
  } = require("fs-extra");


//JSON PATH
const mediaJsonPath=path.join(__dirname,'media.json')

const mediaRouter=express.Router()

//APIS

mediaRouter.get('/',async(req,res,next)=>{
    

        
    
    try {
        
        let moviesArray= await readDB(mediaJsonPath)
       
        if(Object.keys(req.query).length!==0){
            // for(let i=0;i<Object.keys(req.query).length;i++){
             
         let result=moviesArray.filter(movie=>movie[Object.keys(req.query)].includes(req.query[Object.keys(req.query)]))
                
            // }
            res.send(result)
        }
    
        // if(Object.keys(req.query).length!==0){
        //     console.log([Object.keys(req.query)])
        // }

        res.send(moviesArray)
    } catch (error) {
        const err=new Error('PROBLEM WITH GET')
        next(err)
    }
})
mediaRouter.get('/:id',async(req,res,next)=>{
    try {
        
       
        let filteredArray= moviesArray.filter(movie=>movie.imdbID===req.params.id)
      
        res.send(filteredArray)
        
    } catch (error) {
        const err=new Error('PROBLEM WITH GET')
        next(err)
    }
})
mediaRouter.get('/alldetails/:id',async(req,res,next)=>{
    console.log('hi')
    console.log(req.params.id)
    const response = await axios({
        method: "get",
        url: "http://www.omdbapi.com/?i="+req.params.id+"&apikey=8ad00066 " ,
       
        
      });
      res.send(response.data)
})

mediaRouter.post('/',async(req,res,next)=>{
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   const error = new Error()
    //   error.httpStatusCode = 400
    //   error.message = errors
    //   next(error)
    // }
    try {
        let moviesArray=await readDB(mediaJsonPath)
        console.log({...req.body})
        moviesArray.push(req.body)

        await writeDB(mediaJsonPath,moviesArray)
        res.status(201).send(req.body)
    } catch (error) {
        
        next(err)
    }
})

mediaRouter.put('/:id',async(req,res,next)=>{
    try {
        let moviesArray=await readDB(mediaJsonPath)
        let index=moviesArray.findIndex(movie=>movie.imdbID===req.params.id)
        let filteredArray=moviesArray.filter(movie=>movie.imdbID!==req.params.id)
        let replacement={imdbID:req.params.id,...req.body}
        filteredArray.splice(index, 0, replacement);
       

        await writeDB(mediaJsonPath,filteredArray)
        res.send('Ok')
    } catch (error) {
        const err=new Error('PROBLEM WITH PUT')
        next(err)
    }
})
mediaRouter.delete('/:id', async(req,res,next)=>{
    try {
        let moviesArray=await readDB(mediaJsonPath)
        let filteredArray=moviesArray.filter(movie=>movie.imdbID!==req.params.id)
        await writeDB(mediaJsonPath,filteredArray)
        res.send('deleted')
    } catch (error) {
        const err=new Error('PROBLEM WITH DELETE')
        next(err)
    }
})
mediaRouter.post('/media/catalogue',async(req,res)=>{
    let moviesArray=await readDB(mediaJsonPath)
    let title= req.query.title
    let filteredArray=moviesArray.filter(movie=> movie.Title.toLowerCase().includes(title))
    res.send(filteredArray)

    const doc = new PDFDocument();
    
  doc.pipe(createWriteStream("new.pdf"));
for(let i=0;i<filteredArray.length;i++){
    doc
    .font("public/fonts/PalatinoBold.ttf")
    .fontSize(20)
    .text(
      "NAME" + i +': ' + JSON.stringify(filteredArray[i].Title).replace(/"/g, ""),
      100,
      i*50+100
    );
}
 
  doc.end();
}) 


module.exports = mediaRouter
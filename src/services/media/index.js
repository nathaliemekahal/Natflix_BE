//LIBRARIES
const express=require('express')
const path =require('path')

const fs= require('fs-extra')
const {writeDB,readDB}=require('../../utilities')


//JSON PATH
const mediaJsonPath=path.join(__dirname,'media.json')

const mediaRouter=express.Router()

//APIS

mediaRouter.get('/',async(req,res)=>{
    try {
        let moviesArray= await readDB(mediaJsonPath)
        res.send(moviesArray)
    } catch (error) {
        const err=new Error('PROBLEM WITH GET')
    }
})
mediaRouter.get('/:id',async(req,res)=>{
    try {
        let moviesArray= await readDB(mediaJsonPath)
        let filteredArray= moviesArray.filter(movie=>movie.imdbID===req.params.id)
      
        res.send(filteredArray)
    } catch (error) {
        const err=new Error('PROBLEM WITH GET')
    }
})

mediaRouter.post('/',async(req,res)=>{
    try {
        let moviesArray=await readDB(mediaJsonPath)
        console.log({...req.body})
        moviesArray.push(req.body)

        await writeDB(mediaJsonPath,moviesArray)
        res.status(201).send(req.body)
    } catch (error) {
        const err=new Error('PROBLEM WITH POST')
    }
})

mediaRouter.put('/:id',async(req,res)=>{
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
    }
})
mediaRouter.delete('/:id', async(req,res)=>{
    try {
        let moviesArray=await readDB(mediaJsonPath)
        let filteredArray=moviesArray.filter(movie=>movie.imdbID!==req.params.id)
        await writeDB(mediaJsonPath,filteredArray)
        res.send('deleted')
    } catch (error) {
        const err=new Error('PROBLEM WITH DELETE')
    }
})


module.exports = mediaRouter
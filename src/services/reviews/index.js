const express=require('express')
const path=require('path')
const{join}=require('path')
const {writeDB,readDB}=require('../../utilities')
const uniqid=require('uniqid')

const reviewsJsonPath=path.join(__dirname,'reviews.json')

const reviewsRouter=express.Router()


reviewsRouter.get('/',async(req,res)=>{
    try {
        let reviews=await readDB(reviewsJsonPath)
        res.send(reviews)
    } catch (error) {
        const err=new Error('PROBLEM WITH GET')
    }
    
})
reviewsRouter.get('/:id',async(req,res)=>{
    try {
        let reviews=await readDB(reviewsJsonPath)
        let filteredArray= reviews.filter(review=>review.elementId===req.params.id)
      
        res.send(filteredArray)
      
    } catch (error) {
        const err=new Error('PROBLEM WITH GET')
    }
    
})
reviewsRouter.post('/:id',async(req,res)=>{
    try {
       
        let reviews=await readDB(reviewsJsonPath)
        let newReview={_id:uniqid(),elementId:req.params.id,...req.body,createdAt:new Date()+new Date().getHours()}

     
        reviews.push(newReview)
        await writeDB(reviewsJsonPath,reviews)
        res.send('ok')
    } catch (error) {
        const err=new Error('PROBLEM WITH POST')
    }
})

reviewsRouter.put('/:id',async(req,res)=>{
    let reviews=await readDB(reviewsJsonPath)
    let index=reviews.findIndex(review=>review._id===req.params.id)
    console.log(index)
    let filteredArray=reviews.filter(review=>review._id!==req.params.id)
    let replacement={
        _id:req.params.id,
        ...req.body
    }
    filteredArray.splice(index, 0, replacement);
    await writeDB(reviewsJsonPath,filteredArray)
    res.send('ok')
})
reviewsRouter.delete('/:id',async(req,res)=>{
    let reviews= await readDB(reviewsJsonPath)
    let filteredArray=reviews.filter(review=>review._id!==req.params.id)
    await writeDB(reviewsJsonPath,filteredArray)
    res.send('deleted')
})
module.exports=reviewsRouter
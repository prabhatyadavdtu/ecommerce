const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const {isLoggedIn} = require('../middleware');

router.post("/products/:productid/review", isLoggedIn, async(req,res)=>{

    const {productid} = req.params;
    const {rating, comment}= req.body;


    //find the product with the given productid
     const product = await Product.findById(productid);
     const review = await Review.create({ rating , comment})

      product.reviews.push(review);

      await product.save()

     res.redirect(`/products/${productid}`)
})

router.delete("/products/:productid/reviews/:reviewid",isLoggedIn, async(req,res)=>{

    const {reviewid, productid} = req.params;

   await Review.findByIdAndDelete(reviewid);

   req.flash("error", " One review has been deleted!")
    
    res.redirect(`/products/${productid}`)

})

module.exports = router
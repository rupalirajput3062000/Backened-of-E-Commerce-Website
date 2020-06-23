const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("categoty")
    .exec((err,products)=>{
        if(err){
            return res.json({
                message:"Product not Found"
            })
        }
        req.product = products;
        next();
    })
}

exports.createProduct = (req,res)=>{
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with image"
            })
        }

        const {name,description,price,category,stock}=fields;
        if(!name || !description || !price || !category || !stock ){
            res.status(400).json({
                error:"Please entire all fields"
            })
        }
        let product = new Product(fields);

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.json({
                    error:"File size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save the data
        product.save((err,products)=>{
            if(err){
               return res.status(400).json(
                {
                    error:"Not able to save Tshirts to DB"
                }   
                );
            }
            res.json(products);
        })

    })
}

exports.getProduct = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}

//Middleware
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.json({
                error:"Error in deleting product"
            })
        }
        res.json({
            message:"Success in deleting data",
            deletedProduct
        })
    })
}


exports.updateProduct = (req,res)=>{
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with image"
            })
        }

        //Updation Code
        let product = req.product;
        product = _.extend(product,fields);

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.json({
                    error:"File size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save the data
        product.save((err,products)=>{
            if(err){
               return res.status(400).json({
                   error:"Updation Failed"
               })
            }
            res.json(products);
        })

    })
}

exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit):8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy ,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Error in retreiving data"
            })
        }
        res.json(products);
    })
}

exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,result)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to get Uniques Categories"
            })
        }
        res.json(result);
    })
}

exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.products.map(prod=>{
        return{
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc :{stock:-prod.count,sold:+prod.count}}
            }
        }
    }) 
    Product.bulkWrite(myOperations,{},(err,result)=>{
        if(err){
            return res.status(400).json({
                error:"Error in BulkWriting"
            })
        }
        next();
    })
}
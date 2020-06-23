const Category = require("../models/category");


exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
           return res.json({
                message:"Not able to Find Category"
            })
        }
        req.category = cate; 
        next();
    })
}

exports.createCategory = (req,res)=>{
    const category = new Category(req.body);
    category.save((err,category)=>{
        if(err){
        return res.json({
            error:err,
                message:"Not able to save Category"
            })
        }
        res.json({category});
    })
}

exports.getCategory = (req,res)=>{
    res.json(req.category);
}
exports.getAllCategory = (req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.json({
                message:"Not able to get Category"
            })
        }
        return res.json({categories});
    })
}

exports.updateCategory = (req,res)=>{
    const category = req.category;
    category.name = req.body.name;
   category.save((err,result)=>{
    if(err){
        return res.json({
            message:"Not able to update Category"
        })
    }
    else{
        return res.json(result)
    }
   })
}
exports.removeCategory = (req,res)=>{
    const category = req.category;
   category.remove((err,result)=>{
    if(err){
        return res.json({
            message:"Not able to remove category"
        })
    }
    else{
        return res.json({
            message:`Succesfully deleted Category ${result}`
        })
    }
   })
}
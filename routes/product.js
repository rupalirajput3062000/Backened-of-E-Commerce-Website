const express = require("express");
const router = express.Router();

const {getProductById,createProduct,getProduct,photo ,deleteProduct,updateProduct,getAllProducts,getAllUniqueCategories} = require("../controllers/product");
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth");
const {getElementById} = require("../controllers/user");

router.param("productId",getProductById);
router.param("userId",getElementById);

//create product
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);

//read Product
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//delete Product
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);


//update Product
router.post("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

router.get("/products",getAllProducts)
router.get("/products/categories",getAllUniqueCategories)




module.exports = router;
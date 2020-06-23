const express = require("express");
const router = express.Router();

const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth");
const {getCategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory} = require("../controllers/category");
const {getElementById} = require("../controllers/user");

router.param("categoryId",getCategoryById);
router.param("userId",getElementById);

router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory);


module.exports = router;
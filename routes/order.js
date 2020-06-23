const express = require("express");
const router = express.Router();

const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth");
const {getElementById,pushUserInPurchaseList} = require("../controllers/user");
const {updateStock, getAllProducts} = require("../controllers/product");
const {getOrderById,createOrder,getAllOrders,getOrderStatus,updateStatus} = require("../controllers/order");

//param (parameter extarctor)

router.param("userId",getElementById);
router.param("orderId",getOrderById);

//actual route

router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushUserInPurchaseList,updateStock,createOrder);
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus);
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);



module.exports=router;
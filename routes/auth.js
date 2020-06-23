var express = require("express");
var router = express.Router();
var {check,validationResult} = require("express-validator");
const { signout, signup ,signin , isSignedIn} = require("../controllers/auth");

router.post("/signup", 
[
    check("name").isLength({min:3}).withMessage("Length of name must be greater than 3"),
    check("email").isEmail().withMessage("enter correct email"),
    check("password").isLength({min:5}).withMessage("Length of password must be greater than 5")
],signup);
router.post("/signin", 
[
    check("email").isEmail().withMessage("enter correct email"),
    check("password").isLength({min:5}).withMessage("Length of password must be greater than 5")
],signin);
router.get("/signout", signout);


router.get('/test', isSignedIn, (req,res)=>{
    res.json({
        message:"Protected route"
    })
})
module.exports = router;
 
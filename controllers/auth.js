const User = require("../models/user");
var {check,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  var errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({
      errormsg:errors.array()[0].msg,
      errorparam:errors.array()[0].param
    })
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};
 
exports.signin = (req,res)=>{
  var errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({
      errormsg:errors.array()[0].msg,
      errorparam:errors.array()[0].param
    })
  }
const {email,password} = req.body;
  User.findOne({email},(err,result)=>{
    if(err || !result){
      return res.status(404).json({
        error:"Not found the email in DB"
      })
    }

    if(!result.authenticate(password)){
      return res.status(404).json({
        error:"Email or password doesn't match"
      })
    }
    const token = jwt.sign({_id:result._id},process.env.SECRET);
    res.cookie("token" , token ,{expire: new Date() + 2348})

    const {_id,name,email,role} = result;
    return res.status(200).json({
      token,
      user:{_id,name,email,role}
    })
  })
}

exports.signout = (req, res) => {

  res.clearCokkie("token");
  res.json({
    message: "User signout successful"
  });
};

//protected routes

exports.isSignedIn = expressJwt({
  secret:process.env.SECRET,
  userProperty:"auth"
})

//Custom Middlewares

exports.isAuthenticated = (req,res,next)=>{
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker){
    res.status(403).json({
      error:"ACCESS DENIED"
    })
  }
  next();
}


exports.isAdmin = (req,res,next)=>{
if(req.profile.role == 0){
  console.log(req.profile.role);
  return res.status(403).json({
    error:"You are not admin !!! ACCESS DENIED"
  })
}
  next();
}

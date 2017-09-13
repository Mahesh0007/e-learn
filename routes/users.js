var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Include User Model
var User=require('../models/users');
//Include Studenst Model
var Student=require('../models/students');
//Include Instructors Model
var Instructor=require('../models/instructors.js');

//User register
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

//register user
router.post('/register',function(req, res, next) {
  var first_name      = req.body.first_name;
  var last_name       = req.body.last_name;
  var street_address  = req.body.street_address;
  var city            = req.body.city;
  var state           = req.body.state;
  var zip             = req.body.zip;
  var email           = req.body.email;
  var username        = req.body.username;
  var password        = req.body.password;
  var passowrd2       = req.body.password2;
  var type            = req.body.type;

// form validator
req.checkBody('first_name','First Name field required').notEmpty();
req.checkBody('last_name','Last Name field required').notEmpty();
req.checkBody('email','Email field required').notEmpty();
req.checkBody('email','Email Not Valid!').isEmail();
req.checkBody('username','userName field required').notEmpty();
req.checkBody('password','Password field required').notEmpty();
req.checkBody('password2','password do not match!').equals(req.body.password);

var errors = req.validationErrors();
if(errors){
  res.render('users/register',{
    errors : errors
    });
}else{
  var newUser=new User({
    email : email,
    username : username,
    password:password,
    type : type
  });
  if(type=='student'){
    console.log('registering Student...');
    var newStudent = new Student({
      first_name:first_name,
      last_name:last_name,
      address:[{
        street_address:street_address,
        city:city,
        state:state,
        zip:zip
      }],
      email:email,
      username:username
    });
    User.saveStudent(newUser,newStudent,function(err,user){
      console.log('Student created');
    });
  }else{
    console.log('registering Instructor...');
    var newInstructor = new Instructor({
      first_name:first_name,
      last_name:last_name,
      address:[{
        street_address:street_address,
        city:city,
        state:state,
        zip:zip
      }],
      email:email,
      username:username
    });
    User.saveInstructor(newUser,newInstructor,function(err,user){
      console.log('Instructor created');
  });
}

  req.flash('success_msg','User registered Succesfully!');
  res.redirect('/');
}
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/',failureFlash:true}),
  function(req, res) {
    req.flash('success_msg','Congrats! You are logged in now!!');
    var usertype = req.user.type;
    res.redirect('/'+usertype+'s/classes');
  // console.login("Login Working!...");
  });

  passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

  passport.use(new LocalStrategy(function(username,password,done){
    User.getUserByUsername(username,function(err,user){
    //  console.log("user object  is : "+user);

      if(err) throw err;
      if(!user){
        return done(null,false,{message:'Unknown user'});
      }
      User.comparePassword(password,user.password,function(err,isMatch){
        //console.log("Value of isMatch is :"+isMatch);
      //  console.log("user.password is : "+user.password);
        if(err) return done(err);
        if(isMatch){
          console.log("inside isMatch is true if statement");
          return done(null,user);
        }else{

          return done(null,false,{message : 'Invalid Password'});
        }
      });
    });
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg','You have logged out');
    res.redirect('/');
  });



module.exports = router;

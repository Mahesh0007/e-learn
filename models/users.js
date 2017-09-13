var mongoose=require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema=mongoose.Schema({
  username:{
    type:String
  },
  password:{
    type:String,
    bcrypt:true
  },
  type:{
    type:String
  }
});

var User=module.exports = mongoose.model('User',userSchema);

//Get User By Id
module.exports.getUserById= function(id,callback){
  User.findById(id,callback);
}

//get user by username
module.exports.getUserByUsername=function(username,callback){
  var query ={username:username};
  User.findOne(query,callback);
}

//compare password
module.exports.comparePassword=function(candidatepassword,hash,callback){
  bcrypt.compare(candidatepassword,hash,function(err,isMatch){
    if(err) throw err;
    callback(null,isMatch);
  });
}

//Create Student User
module.exports.saveStudent=function(newuser,newStudent,callback){
  console.log('saveStudent has been called!!!!!');
  bcrypt.hash(newuser.password,10,function(err,hash){
    if(err) throw err;
    newuser.password = hash;
    console.log("Student is being saved!");
    async.parallel([newuser.save.bind(newuser),newStudent.save.bind(newStudent)],callback);
  });
}

//Create for Instrctor username
module.exports.saveInstructor=function(newuser,newInstructor,callback){
  bcrypt.hash(newuser.password,10,function(err,hash){
    if(err) throw err;
    newuser.password = hash;
    console.log("Instructor is being saved!");
    async.parallel([newuser.save.bind(newuser),newInstructor.save.bind(newInstructor)],callback);
  });
}

var mongoose=require('mongoose');

var studentschema=mongoose.Schema({
  first_name:{
    type:String
  },
  last_name:{
    type:String
  },
  address:[{
    street_address:{type:String},
    city:{type:String},
    state:{type:String},
    Zip:{type:String}
  }],
  username:{
    type:String
  },
  email:{
    type:String
  },
  classes:[{
    class_id:{type:[mongoose.Schema.Types.ObjectId]},
    class_title:{type:String}
  }]
});

var Student = module.exports=mongoose.model('Student',studentschema);

//get student by username
module.exports.getStudentByUsername=function(username,callback){
  var query ={username:username};
  Student.findOne(query,callback);
}

const mongoose = require("mongoose");

const account3schema = new mongoose.Schema({
    
    name:{type:String},
    email:{type:String,required:true,unique:true},
    username:{type:String },
    password:{type:String ,required:true },
    date:{type:Date, default:Date.now},
    phone:String,
    country:String,
    role:{type:String,default:"student"}   
});
module.exports= mongoose.model("account3",account3schema)
  
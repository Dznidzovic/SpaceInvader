const mongoose = require('mongoose');

const signUpTemplate = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    highestScore:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model('mytable',signUpTemplate);
const { response } = require('express');
const express = require('express');
const router = express.Router()
const signupTemplateCopy = require('../models/SignUpmodel');


router.post('/signup',(req,res)=>{
    console.log(req.body);
    const signedUpUser = new signupTemplateCopy({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        highestScore:req.body.highestScore
    })
    signedUpUser.save()
    .then(data=>{
        res.json(data);
    }).catch(err=>res.json(err));
});
router.get('/login',(req,res)=>{
    signupTemplateCopy.find({}).then((accs)=>{
        res.send(accs);
    })
    .catch((error)=>{
        res.status(500).send(error);
    })
})
router.put('/:id',(req,res)=>{
    console.log(req.params.id);
    signupTemplateCopy.findOneAndUpdate({_id:req.params.id},{
        $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            highestScore:req.body.highestScore
            
        }
    })
    .then(result=>{
        res.status(200).json({
            updated_object:result
        })
    })
    .catch(err=>console.log(err));
})
module.exports = router;

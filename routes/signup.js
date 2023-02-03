const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//When server is ready, connect here
/*
mongoose.connect('mongodb+srv://Mennato:November2.@atlascluster.pzbj0y5.mongodb.net/test')
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDb...',err))
    */

    const userSchema = new mongoose.Schema({
      firstName: String, 
      lastName: String,
      email: String,
      date: {type: Date, default: Date.now},
      mobileNumber: Number,
      password: Number,
  });

  const User = mongoose.model('User', userSchema);//this gives us a class

//GET
//this is to test endpoint...
router.get("/sign-up", (req, res) => {
  res.send("Hello Worleed");
});


async function createCourse(userData){

  const user = new User({ 
    firstName: userData.firstName, 
    lastName: userData.lastName,
    email: userData.email,
    mobileNumber: userData.mobileNumber,
    password: userData.password
  });
   await course.save()
      .then(result => {
          console.log('Result',result);
      }).catch((error)=>{
          console.log('Error', error);
      });
}

  //Create a User
  app.post('/sign-up', (req, res) => {
    //store user data from the request body
    const userData = req.body;
    
    //add user data to database
    createCourse(userData);
  
    //return success response
    res.json({
      message: 'User created successfully',
      data: userData
    });
  });


  module.exports = router;
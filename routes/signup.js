const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');


//When server is ready, connect here
/*mongoose.connect('mongodb+srv://Mennato:November2.@atlascluster.pzbj0y5.mongodb.net/test')
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDb...',err))*/
    

//Connect to host here
//app.listen(1017, () => console.log('Listening on port 1017...'))


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
router.get("/", (req, res) => {
  console.log(req);
  //res.send("Hello World");
});


async function createUser(userData){

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
    //createUser(userData);
  
    //return success response
    res.json({
      message: 'User created successfully',
      data: userData
    });
  });


  module.exports = router;
const express = require('express');
const router = express.Router();



//GET
router.get("/", (req, res) => {
    res.send("Hello World"); //Test
  });


//POST
  router.post("/", (req, res) => {
    const {error} = validateGenere(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  });


// PUT route to update a user
router.put('/users/:id', (req, res) => {
    let userId = req.params.id;
    let updatedUser = req.body;
  
    User.findByIdAndUpdate(userId, updatedUser, {new: true})
      .then(user => {
        res.status(200).json({
          message: 'User successfully updated',
          user
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error updating user',
          err
        });
      });
  });

// DELETE route to delete a user
router.delete('/users/:id', (req, res) => {
    let userId = req.params.id;
  
    User.findByIdAndRemove(userId)
      .then(user => {
        res.status(200).json({
          message: 'User successfully deleted',
          user
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error deleting user',
          err
        });
      });
  });

  module.exports = router;
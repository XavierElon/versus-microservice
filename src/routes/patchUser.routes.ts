import express, { Request, Response, Router } from 'express'
import { updateUser } from '../services/user.service'
export const updateRouter: Router = express.Router()



// Update a user by ID
updateRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const update = req.body;
      console.log('Id - > ', id);
      // Find the user by ID and update its properties
      const updatedUser = updateUser(id,update);
      if (!updatedUser) {
        return res.status(404).send({ error: 'User not found' });
      }else{
        return res.status(200).send({updatedUser, message: 'User updated'});
      }
    } catch (error) {
      console.error(`Error updating user: ${error}`);
      return res.status(500).send({ error: 'Server error' });
    }
  });
import express, { Request, Response, Router } from 'express'
import { deleteUser } from '../services/user.service'
export const deleteRouter: Router = express.Router()


// Delete user by email endpoint
deleteRouter.delete('/delete/:email', async (req, res) => {
    const email = req.params.email;
    try {
      const deletedUser = await deleteUser(email);
      if (!deletedUser) {
        return res.status(404).send(`User with email ${email} not found`);
      }
      return res.send(`Deleted user: ${deletedUser}`);
    } catch (err) {
      console.error(`Error deleting user with email ${email}:`, err);
      return res.status(500).send('Error deleting user');
    }
  });
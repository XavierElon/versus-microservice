import express, { Request, Response, Router } from 'express'
import {
  createUser,
  checkIfUserExists,
  updateUser,
  verifyUser,
  deleteUser,
  confirmUser
} from '../services/user.service'

export const signupRouter: Router = express.Router()
export const updateRouter: Router = express.Router()
export const loginRouter: Router = express.Router()
export const deleteRouter: Router = express.Router()
export const validationRouter: Router = express.Router()

// Create a User
signupRouter.post('/signup', async (req: Request, res: Response) => {
  const userData = req.body
  const userExists = await checkIfUserExists(userData.email)
  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  } else {
    createUser(userData)
      .then((result) => {
        console.log('User created successfully: ', result)
        res.status(201).json({ message: 'User created', data: userData })
      })
      .catch((error) => {
        console.log('Error creating user: ', error)
        res.status(500).json({ message: 'Error creating user', error })
      })
  }
})

// Update a user by ID
updateRouter.put('/update/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const update = req.body
    // Find the user by ID and update its properties
    const updatedUser = updateUser(id, update)
    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' })
    } else {
      return res.status(200).send({ updatedUser, message: 'User updated' })
    }
  } catch (error) {
    console.error(`Error updating user: ${error}`)
    return res.status(500).send({ error: 'Server error' })
  }
})

/*Verify user credentials against the database and login*/
loginRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  const isValid = await verifyUser(email, password)

  if (isValid) {
    res.status(200).json({ message: 'Login successful' })
  } else {
    res.status(401).json({ message: 'Incorrect username or password, please make sure you have confirmed your email' })
  }
})

// Delete user by email endpoint
deleteRouter.delete('/delete/:email', async (req, res) => {
  const email = req.params.email
  try {
    const deletedUser = await deleteUser(email)
    if (!deletedUser) {
      return res.status(404).send(`User with email ${email} not found`)
    }
    return res.send(`Deleted user: ${deletedUser}`)
  } catch (err) {
    console.error(`Error deleting user with email ${email}:`, err)
    return res.status(500).send('Error deleting user')
  }
})

//Confirm the user has created an account
validationRouter.get('/validate-account-creation/:userID', async (req, res) => {
  try {
    const { confirmed, token } = req.query
    if (confirmed === 'true' && typeof token === 'string') {
      res.send('Your account has been successfully created and confirmed.')
      await confirmUser(token)
    } else {
      res.send('Your account has been created. Please check your email to confirm your account.')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while validating your account creation.')
  }
})

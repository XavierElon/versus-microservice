import { User } from '../models/user.model'
import mongoose, { Model } from 'mongoose';

/*
CREATE USER
This function creates a new user using the userSchema and saves it to the database
*/
export const createUser = async (userData: typeof User): Promise<any> => {
  const user = new User(userData)
  return user
    .save()
    .then((result: any) => {
      console.log('Result:', result)
      return Promise.resolve(result)
    })
    .catch((error: any) => {
      console.log('Error creating user: ', error)
      return Promise.reject(error)
    })
}


/*
VERIFY USER
check the username and password against the database to approve login
*/
export const verifyUser = async (username: string, password: string) => {
  const existingUser = await User.findOne({ username, password });
  if (existingUser) {
    return true;
  }
  return false;
};


/*
CHECK IF USER EXISTS 
check the username against the database for duplicates before proceeding with creation of new user
*/
export const checkIfUserExists = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return true;
  }
  return false;
};

/*
UPDATE USER INFORMATION
*/
export const updateUser = async (id: string, update: Partial<typeof User>): Promise<typeof User | null> => {
  const UserModel: Model<Document & typeof User> = mongoose.model('User');
  try {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, update, { new: true });
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    return null;
  }
};

/*
FIND USER BY ID 
check the username against the database for duplicates before proceeding with creation of new user
*/
export const findUserById = async (id: string) => {
  const existingUser = await User.findOne({ id });
  if (existingUser) {
    return true;
  }
  return false;
};
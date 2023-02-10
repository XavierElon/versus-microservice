
import { userSchema } from '../models/user.model'
import * as mongoose from 'mongoose';
const User = mongoose.model('User', userSchema);

/*
CREATE USER
This function creates a new user using the userSchema and saves it to the database
*/
export const createUser = async (userData: typeof userSchema): Promise<any> => {
  const user = new User(userData);
  return user.save()
    .then((result: any) => {
      console.log('Result:', result);
      return Promise.resolve(result);
    })
    .catch((error: any) => {
      console.log('Error creating user: ', error);
      return Promise.reject(error);
    });
};

/*
VERIFY USER
check the username and password against the database to approve login
*/
export const verifyUser = async (username: string, password: string): Promise<boolean> => {
  const user = await User.findOne({ username, password });
  return user !== null;
};


/*
CHECK IF USER EXISTS 
check the username against the database for duplicates before proceeding with creation of new user
*/
export const checkIfUserExists = async (username: string): Promise<boolean> => {
  const user = await User.findOne({ username });
  return user !== null;
};


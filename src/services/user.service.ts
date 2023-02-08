const mongoose = require('mongoose')
import {isValidPhoneNumber,
  isValidPassword,isValidEmail,
  isValidUsername,isValidName} from '../utils/verification.helper'
import { userSchema } from '../models/user.model'
import { validUser } from '../structures/types'
const User = mongoose.model('User', userSchema) 

export const createUser = async (userData: typeof userSchema) => {
  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    mobileNumber: userData.mobileNumber,
    password: userData.password,
    userName: userData.userName
  })

  await user.save()
    .then((result: any) => {
      console.log('Result:', result)
    })
    .catch((error: any) => {
      console.log('Error creating user: ', error)
    })
};

//this will find a user in the database with the mathcing username and password
export const verifyUser = async (username: string, password: string): Promise<boolean> => {
  const user = await User.findOne({ username, password });
  return user !== null;
};

/*
CHECK IF USER EXISTS 
this will find a user in the database with a matching username,  this will be used to find duplicates before creating
a new user
*/
export const checkIfUserExists = async (username: string): Promise<boolean> => {
  const user = await User.findOne({ username });
  return user !== null;
};


//This is used as a setter and called within the valiatUser function
const setValidUser = async (isValid:boolean, errorMessage:string): Promise<validUser> => {
  
  const responseToReturn: validUser = {} as validUser;
  responseToReturn.isValid = isValid;
  responseToReturn.errorMessage = errorMessage;
  return responseToReturn;

}
/*
VALIDATE USER
this will validate all the new users information before creating
*/
export const validateUser = async (User: typeof userSchema): Promise<validUser> => {
  
  if(!isValidPhoneNumber(User.mobileNumber)){
    return setValidUser(false, ('Invalid Phone Number'));
  }

  if(!isValidPassword(User.password)){
    return setValidUser(false, ('Invalid Password'));
  }

  if(!isValidEmail(User.email)){
    return setValidUser(false, ('Invalid Email'));
  }

  if(!isValidUsername(User.userName)){
    return setValidUser(false, ('Invalid Username'));
  }

  if(!isValidName(User.lastName)){
    return setValidUser(false, ('Invalid Lastname'));
  }

  if(!isValidName(User.firstName)){
    return setValidUser(false, ('Invalid Firstname'));
  }
  
  return setValidUser(true, ('Valid User'));
  
}